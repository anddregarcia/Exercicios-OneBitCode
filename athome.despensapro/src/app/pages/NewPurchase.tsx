import { Fragment, useEffect, useMemo, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { ChevronDown, ChevronRight, History, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { brandsAPI, categoriesAPI, itemsAPI, purchasesAPI, storesAPI, unitsAPI, packagingsAPI } from "../lib/api";
import { QuickAddItem } from "../components/QuickAddItem";
import { QuickAddStore } from "../components/QuickAddStore";
import { usePurchaseForm } from "../contexts/PurchaseFormContext";

interface PurchaseRow {
  key: string;
  itemId: string;
  brandId: string;
  selected: boolean;
  price: string;
  quantity: string;
}

const sortByName = (list: any[]) => [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
const today = () => new Date().toISOString().split("T")[0];

export function NewPurchase() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [packagings, setPackagings] = useState<any[]>([]);

  const {
    selectedStore,
    setSelectedStore,
    purchaseDate,
    setPurchaseDate,
    purchaseItems,
    setPurchaseItems,
    clearForm,
  } = usePurchaseForm();

  const [historyDialogItem, setHistoryDialogItem] = useState<string | null>(null);
  const [itemHistory, setItemHistory] = useState<any[]>([]);
  const [quickAddItemOpen, setQuickAddItemOpen] = useState(false);
  const [quickAddStoreOpen, setQuickAddStoreOpen] = useState(false);
  const [groupByCategory, setGroupByCategory] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, []);

  const resetPurchaseRows = (itemsData: any[]) => {
    const rows = itemsData.flatMap((item) => {
      const brandIds = item.brandIds?.length ? item.brandIds : [];
      if (brandIds.length === 0) {
        return [{ key: `${item.id}:none`, itemId: item.id, brandId: "none", selected: false, price: "", quantity: "" }];
      }
      return brandIds.map((brandId: string) => ({
        key: `${item.id}:${brandId}`,
        itemId: item.id,
        brandId,
        selected: false,
        price: "",
        quantity: "",
      }));
    });
    setPurchaseItems(rows);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsData, storesData, brandsData, categoriesData, unitsData, packagingsData] = await Promise.all([
        itemsAPI.getAll(),
        storesAPI.getAll(),
        brandsAPI.getAll(),
        categoriesAPI.getAll(),
        unitsAPI.getAll(),
        packagingsAPI.getAll(),
      ]);

      const orderedItems = sortByName(itemsData);
      setItems(orderedItems);
      setStores(sortByName(storesData));
      setBrands(sortByName(brandsData));
      setCategories(sortByName(categoriesData));
      setUnits(sortByName(unitsData));
      setPackagings(sortByName(packagingsData));

      if (!purchaseItems.length) {
        resetPurchaseRows(orderedItems);
      } else {
        const keys = new Set(purchaseItems.map((row: PurchaseRow) => row.key));
        const fresh = orderedItems.flatMap((item) => (item.brandIds || []).map((brandId: string) => `${item.id}:${brandId}`));
        const missing = fresh.filter((key) => !keys.has(key)).map((key) => {
          const [itemId, brandId] = key.split(":");
          return { key, itemId, brandId, selected: false, price: "", quantity: "" };
        });
        if (missing.length) setPurchaseItems([...(purchaseItems as PurchaseRow[]), ...missing]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key: string, field: "selected" | "price" | "quantity", value: boolean | string) => {
    setPurchaseItems((prev: any[]) => prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
  };

  const handleSavePurchase = async () => {
    if (!selectedStore) return toast.error("Selecione um mercado");
    const selectedRows = (purchaseItems as PurchaseRow[]).filter((row) => row.selected);
    if (!selectedRows.length) return toast.error("Selecione pelo menos um item");

    const invalidRows = selectedRows.filter((row) => !row.price || !row.quantity || Number(row.price) <= 0 || Number(row.quantity) <= 0);
    if (invalidRows.length) return toast.error("Preencha preço e quantidade dos itens selecionados");

    setSaving(true);
    try {
      await purchasesAPI.create({
        storeId: selectedStore,
        date: purchaseDate,
        items: selectedRows.map((row) => ({
          itemId: row.itemId,
          brandId: row.brandId === "none" ? undefined : row.brandId,
          price: row.price,
          quantity: row.quantity,
        })),
      });
      toast.success("Compra registrada com sucesso!");
      clearForm();
      resetPurchaseRows(items);
      setSelectedStore("");
      setPurchaseDate(today());
    } catch {
      toast.error("Erro ao salvar compra");
    } finally {
      setSaving(false);
    }
  };

  const startNewPurchase = () => {
    clearForm();
    setSelectedStore("");
    setPurchaseDate(today());
    resetPurchaseRows(items);
    toast.success("Formulário pronto para uma nova compra");
  };

  const getItemName = (itemId: string) => items.find((i) => i.id === itemId)?.name || "";
  const getBrandName = (brandId: string) => brands.find((b) => b.id === brandId)?.name || "Sem marca";
  const getCategoryName = (categoryId: string) => categories.find((c) => c.id === categoryId)?.name || "Sem categoria";
  const getItemById = (id: string) => items.find((i) => i.id === id);
  const getStoreName = (storeId: string) => stores.find((store) => store.id === storeId)?.name || "Mercado não informado";

  const formatItemDetails = (item: any) => {
    if (!item?.packageSize) return "";
    const packaging = packagings.find((p) => p.id === item.packagingId)?.name;
    const unit = units.find((u) => u.id === item.unitId)?.abbreviation || units.find((u) => u.id === item.unitId)?.name;
    if (!packaging || !unit) return "";
    return ` (${packaging} de ${item.packageSize} ${unit})`;
  };

  const rowsWithItem = useMemo(() => (purchaseItems as PurchaseRow[])
    .map((row) => ({ ...row, item: getItemById(row.itemId) }))
    .filter((row) => row.item)
    .sort((a, b) => a.item.name.localeCompare(b.item.name, "pt-BR")), [purchaseItems, items]);

  const groupedItems = useMemo(() => rowsWithItem.reduce((acc: Record<string, any[]>, row) => {
    const category = getCategoryName(row.item.categoryId);
    if (!acc[category]) acc[category] = [];
    acc[category].push(row);
    return acc;
  }, {}), [rowsWithItem, categories]);

  const orderedCategories = useMemo(() => Object.keys(groupedItems).sort((a, b) => a.localeCompare(b, "pt-BR")), [groupedItems]);

  const toggleCategoryCollapse = (category: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleViewHistory = async (itemId: string) => {
    const history = await itemsAPI.getHistory(itemId);
    setItemHistory(history);
    setHistoryDialogItem(itemId);
  };

  const handleItemCreated = (newItem: any) => {
    const ordered = sortByName([...items, newItem]);
    setItems(ordered);
    resetPurchaseRows(ordered);
  };

  const handleStoreCreated = (newStore: any) => {
    setStores(sortByName([...stores, newStore]));
    setSelectedStore(newStore.id);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Nova Compra</h1>
          <p className="mt-2 text-muted-foreground">Registre os itens comprados e seus preços.</p>
        </div>

        <Card className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Mercado</Label>
              <div className="flex gap-2">
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger><SelectValue placeholder="Selecione o mercado" /></SelectTrigger>
                  <SelectContent>{stores.map((store) => <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>)}</SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={() => setQuickAddStoreOpen(true)}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data da Compra</Label>
              <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={handleSavePurchase} disabled={saving}>{saving ? "Salvando..." : "Salvar Compra"}</Button>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={startNewPurchase}>Iniciar Nova Compra</Button>
          </div>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" onClick={() => setQuickAddItemOpen(true)}><Plus className="h-4 w-4 mr-2" />Cadastrar Novo Item</Button>
          <div className="flex items-center gap-2">
            <Checkbox id="group-by-category" checked={groupByCategory} onCheckedChange={(checked) => setGroupByCategory(checked as boolean)} />
            <Label htmlFor="group-by-category" className="cursor-pointer">Agrupar Itens por Categoria</Label>
          </div>
        </div>

        <Card className="hidden md:block overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm">Comprou?</th>
                  <th className="px-4 py-3 text-left text-sm">Item</th>
                  <th className="px-4 py-3 text-left text-sm">Marca</th>
                  <th className="px-4 py-3 text-left text-sm">Categoria</th>
                  <th className="px-4 py-3 text-left text-sm">Preço</th>
                  <th className="px-4 py-3 text-left text-sm">Quantidade</th>
                  <th className="px-4 py-3 text-left text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {!groupByCategory && rowsWithItem.map((row) => (
                  <tr key={row.key} className="border-b hover:bg-muted/20">
                    <td className="px-4 py-3"><Checkbox checked={row.selected} onCheckedChange={(checked) => handleFieldChange(row.key, "selected", checked as boolean)} /></td>
                    <td className="px-4 py-3 font-medium">{row.item.name}{formatItemDetails(row.item)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{getBrandName(row.brandId)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{getCategoryName(row.item.categoryId)}</td>
                    <td className="px-4 py-3"><Input type="number" step="0.01" className="w-24" value={row.price} onChange={(e) => handleFieldChange(row.key, "price", e.target.value)} /></td>
                    <td className="px-4 py-3"><Input type="number" step="0.01" className="w-24" value={row.quantity} onChange={(e) => handleFieldChange(row.key, "quantity", e.target.value)} /></td>
                    <td className="px-4 py-3"><Button variant="ghost" size="sm" onClick={() => handleViewHistory(row.itemId)}><History className="h-4 w-4 mr-1" />Histórico</Button></td>
                  </tr>
                ))}

                {groupByCategory && orderedCategories.map((category) => (
                  <Fragment key={category}>
                    <tr className="border-b bg-muted/50">
                      <td colSpan={7} className="px-4 py-2">
                        <button type="button" className="flex items-center gap-2 font-semibold" onClick={() => toggleCategoryCollapse(category)}>
                          {collapsedCategories[category] ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          {category}
                        </button>
                      </td>
                    </tr>
                    {!collapsedCategories[category] && groupedItems[category].map((row) => (
                      <tr key={row.key} className="border-b hover:bg-muted/20">
                        <td className="px-4 py-3"><Checkbox checked={row.selected} onCheckedChange={(checked) => handleFieldChange(row.key, "selected", checked as boolean)} /></td>
                        <td className="px-4 py-3 font-medium">{row.item.name}{formatItemDetails(row.item)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{getBrandName(row.brandId)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{category}</td>
                        <td className="px-4 py-3"><Input type="number" step="0.01" className="w-24" value={row.price} onChange={(e) => handleFieldChange(row.key, "price", e.target.value)} /></td>
                        <td className="px-4 py-3"><Input type="number" step="0.01" className="w-24" value={row.quantity} onChange={(e) => handleFieldChange(row.key, "quantity", e.target.value)} /></td>
                        <td className="px-4 py-3"><Button variant="ghost" size="sm" onClick={() => handleViewHistory(row.itemId)}><History className="h-4 w-4 mr-1" />Histórico</Button></td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-3 md:hidden">
          {!groupByCategory && rowsWithItem.map((row) => (
            <Card key={row.key} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{row.item.name}{formatItemDetails(row.item)}</p>
                    <p className="text-sm text-muted-foreground">{getBrandName(row.brandId)} • {getCategoryName(row.item.categoryId)}</p>
                  </div>
                  <Checkbox checked={row.selected} onCheckedChange={(checked) => handleFieldChange(row.key, "selected", checked as boolean)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Preço</Label>
                    <Input type="number" step="0.01" value={row.price} onChange={(e) => handleFieldChange(row.key, "price", e.target.value)} />
                  </div>
                  <div>
                    <Label>Quantidade</Label>
                    <Input type="number" step="0.01" value={row.quantity} onChange={(e) => handleFieldChange(row.key, "quantity", e.target.value)} />
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleViewHistory(row.itemId)}><History className="h-4 w-4 mr-1" />Histórico</Button>
              </div>
            </Card>
          ))}

          {groupByCategory && orderedCategories.map((category) => (
            <div key={category} className="space-y-2">
              <button
                type="button"
                className="w-full rounded-md border bg-muted/50 px-3 py-2 text-left font-semibold flex items-center gap-2"
                onClick={() => toggleCategoryCollapse(category)}
              >
                {collapsedCategories[category] ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {category}
              </button>
              {!collapsedCategories[category] && groupedItems[category].map((row) => (
                <Card key={row.key} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{row.item.name}{formatItemDetails(row.item)}</p>
                        <p className="text-sm text-muted-foreground">{getBrandName(row.brandId)} • {category}</p>
                      </div>
                      <Checkbox checked={row.selected} onCheckedChange={(checked) => handleFieldChange(row.key, "selected", checked as boolean)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Preço</Label>
                        <Input type="number" step="0.01" value={row.price} onChange={(e) => handleFieldChange(row.key, "price", e.target.value)} />
                      </div>
                      <div>
                        <Label>Quantidade</Label>
                        <Input type="number" step="0.01" value={row.quantity} onChange={(e) => handleFieldChange(row.key, "quantity", e.target.value)} />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleViewHistory(row.itemId)}><History className="h-4 w-4 mr-1" />Histórico</Button>
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={historyDialogItem !== null} onOpenChange={(open) => !open && setHistoryDialogItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Histórico de preços - {historyDialogItem ? getItemName(historyDialogItem) : ""}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {itemHistory.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Última compra em: <span className="font-medium text-foreground">{getStoreName(itemHistory[0].storeId)}</span>
              </p>
            )}
            {itemHistory.map((purchase) => (
              <div key={purchase.id} className="border rounded p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{new Date(purchase.date).toLocaleDateString("pt-BR")}</p>
                  <p className="text-sm font-medium text-foreground">{getStoreName(purchase.storeId)}</p>
                </div>
                <span className="font-medium">R$ {purchase.price.toFixed(2)}</span>
              </div>
            ))}
            {!itemHistory.length && <p className="text-sm text-muted-foreground">Sem histórico para este item.</p>}
          </div>
        </DialogContent>
      </Dialog>

      <QuickAddItem open={quickAddItemOpen} onOpenChange={setQuickAddItemOpen} onItemCreated={handleItemCreated} />
      <QuickAddStore open={quickAddStoreOpen} onOpenChange={setQuickAddStoreOpen} onStoreCreated={handleStoreCreated} />
    </div>
  );
}
