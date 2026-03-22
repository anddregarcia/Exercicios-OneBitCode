import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { AlertCircle, Edit, Package2, Loader2 } from "lucide-react";
import { itemsAPI, pantryAPI, brandsAPI, unitsAPI, storesAPI, packagingsAPI, categoriesAPI, purchasesAPI } from "../lib/api";
import { toast } from "sonner";

export function Pantry() {
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editOpenedDate, setEditOpenedDate] = useState("");

  const [pantryItems, setPantryItems] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [packagings, setPackagings] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pantryData, itemsData, brandsData, categoriesData, unitsData, packagingsData, storesData, purchasesData] = await Promise.all([
        pantryAPI.getAll(),
        itemsAPI.getAll(),
        brandsAPI.getAll(),
        categoriesAPI.getAll(),
        unitsAPI.getAll(),
        packagingsAPI.getAll(),
        storesAPI.getAll(),
        purchasesAPI.getAll(),
      ]);

      setItems(itemsData);
      setBrands(brandsData);
      setCategories(categoriesData);
      setUnits(unitsData);
      setPackagings(packagingsData);
      setStores(storesData);

      const pantryMap = new Map(pantryData.map((pantryItem: any) => [pantryItem.itemId, pantryItem]));
      const latestPurchaseByItem = new Map<string, any>();

      [...purchasesData]
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .forEach((purchase: any) => {
          if (!latestPurchaseByItem.has(purchase.itemId)) {
            latestPurchaseByItem.set(purchase.itemId, purchase);
          }
        });

      const enrichedPantry = itemsData.map((item: any) => {
        const pantryItem = pantryMap.get(item.id);
        const lastPurchase = latestPurchaseByItem.get(item.id);

        return {
          itemId: item.id,
          currentQuantity: pantryItem?.currentQuantity ?? 0,
          openedDate: pantryItem?.openedDate || "",
          lastPurchasePrice: lastPurchase?.price ?? pantryItem?.lastPurchasePrice,
          lastPurchaseStore: lastPurchase
            ? storesData.find((store: any) => store.id === lastPurchase.storeId)?.name || null
            : pantryItem?.lastPurchaseStore || null,
        };
      });

      setPantryItems(enrichedPantry);
    } catch (error) {
      console.error("Error loading pantry data:", error);
      toast.error("Erro ao carregar dados da despensa");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (itemId: string) => {
    const pantryItem = pantryItems.find(p => p.itemId === itemId);
    if (pantryItem) {
      setSelectedItemId(itemId);
      setEditQuantity(pantryItem.currentQuantity?.toString() || "0");
      setEditOpenedDate(pantryItem.openedDate || "");
      setEditDialogOpen(true);
    }
  };

  const handleSaveQuantity = async () => {
    if (!selectedItemId || !editQuantity) return;

    const currentQuantity = Number.parseFloat(editQuantity);
    if (Number.isNaN(currentQuantity)) {
      toast.error("Informe uma quantidade válida");
      return;
    }
    
    try {
      await pantryAPI.update(selectedItemId, {
        currentQuantity,
        openedDate: editOpenedDate || undefined,
      });

      setPantryItems((prev) => prev.map((pantryItem) => (
        pantryItem.itemId === selectedItemId
          ? {
              ...pantryItem,
              currentQuantity,
              openedDate: editOpenedDate || "",
            }
          : pantryItem
      )));

      toast.success("Quantidade atualizada com sucesso!");
      setEditDialogOpen(false);
      setSelectedItemId(null);
      setEditQuantity("");
      setEditOpenedDate("");
    } catch (error) {
      console.error("Error updating pantry item:", error);
      toast.error("Erro ao atualizar quantidade");
    }
  };

  const isLowStock = (quantity: number) => quantity <= 0.3;
  
  const parseStoredDate = (date?: string) => {
    if (!date) return null;

    const [year, month, day] = date.split("-").map(Number);
    if (!year || !month || !day) return null;

    return new Date(year, month - 1, day);
  };

  const formatStoredDate = (date?: string) => {
    const parsedDate = parseStoredDate(date);
    return parsedDate ? parsedDate.toLocaleDateString("pt-BR") : "—";
  };
  
  const isOldProduct = (openedDate?: string) => {
    const parsedDate = parseStoredDate(openedDate);
    if (!parsedDate) return false;

    const daysSinceOpened = Math.floor(
      (new Date().getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceOpened > 30;
  };

  const getBrandName = (brandId?: string) => brandId ? brands.find((b) => b.id === brandId)?.name || "Sem marca" : "Sem marca";
  const getCategoryName = (categoryId?: string) => categoryId ? categories.find((category) => category.id === categoryId)?.name || "Sem categoria" : "Sem categoria";
  const getUnitAbbr = (unitId: string) => units.find(u => u.id === unitId)?.abbreviation || "";

  const getPackagingName = (packagingId: string) => packagings.find((p) => p.id === packagingId)?.name || "";

  const getItemDisplaySize = (item: any) => {
    const packaging = getPackagingName(item.packagingId);
    if (!packaging) return "";

    const unit = getUnitAbbr(item.unitId);
    if (!item?.packageSize || !unit) return packaging;

    return `${packaging} de ${item.packageSize} ${unit}`;
  };

  const getPantryQuantityLabel = (pantryItem: any, item: any) => {
    const packageDetails = getItemDisplaySize(item);
    return packageDetails
      ? `${pantryItem.currentQuantity} ${packageDetails}`
      : `${pantryItem.currentQuantity}`;
  };

  const expandedPantryRows = pantryItems
    .flatMap((pantryItem) => {
      const item = items.find((i) => i.id === pantryItem.itemId);
      if (!item) return [];

      const brandIds = item.brandIds?.length
        ? item.brandIds
        : item.brandId
          ? [item.brandId]
          : [undefined];

      return brandIds.map((brandId: string | undefined) => ({
        key: `${pantryItem.itemId}:${brandId || "none"}`,
        pantryItem,
        item,
        brandId,
        categoryName: getCategoryName(item.categoryId),
      }));
    })
    .sort((a, b) => {
      const nameComparison = a.item.name.localeCompare(b.item.name, "pt-BR");
      if (nameComparison !== 0) return nameComparison;

      const categoryComparison = a.categoryName.localeCompare(b.categoryName, "pt-BR");
      if (categoryComparison !== 0) return categoryComparison;

      return getBrandName(a.brandId).localeCompare(getBrandName(b.brandId), "pt-BR");
    });

  const selectedItem = selectedItemId ? items.find(i => i.id === selectedItemId) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Gestão de Despensa</h1>
          <p className="mt-2 text-muted-foreground">
            Acompanhe o estoque e validade dos seus produtos
          </p>
        </div>

        {/* Desktop Table */}
        {expandedPantryRows.length > 0 ? (
          <>
            <Card className="hidden md:block overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Item
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Marca
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Categoria
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Quantidade Atual
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Data de Abertura
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Último Preço
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Último Mercado
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {expandedPantryRows.map(({ key, pantryItem, item, brandId, categoryName }) => {
                      const lowStock = isLowStock(pantryItem.currentQuantity);
                      const oldProduct = isOldProduct(pantryItem.openedDate);

                      return (
                        <tr key={key} className="border-b border-border hover:bg-muted/30">
                          <td className="px-4 py-4">
                            <span className="font-medium text-foreground">{item.name}{getItemDisplaySize(item) ? ` (${getItemDisplaySize(item)})` : ""}</span>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">
                            {getBrandName(brandId)}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">
                            {categoryName}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${lowStock ? 'text-destructive' : 'text-foreground'}`}>
                                {getPantryQuantityLabel(pantryItem, item)}
                              </span>
                              {lowStock && (
                                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                                  Estoque baixo
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">
                            {formatStoredDate(pantryItem.openedDate)}
                          </td>
                          <td className="px-4 py-4 font-medium text-foreground">
                            {pantryItem.lastPurchasePrice
                              ? `R$ ${pantryItem.lastPurchasePrice.toFixed(2)}`
                              : "—"}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">
                            {pantryItem.lastPurchaseStore || "—"}
                          </td>
                          <td className="px-4 py-4">
                            {oldProduct && (
                              <div className="flex items-center gap-1 text-warning">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-xs">Aberto há 30+ dias</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(pantryItem.itemId)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {expandedPantryRows.map(({ key, pantryItem, item, brandId, categoryName }) => {
                const lowStock = isLowStock(pantryItem.currentQuantity);
                const oldProduct = isOldProduct(pantryItem.openedDate);

                return (
                  <Card key={key} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{item.name}{getItemDisplaySize(item) ? ` (${getItemDisplaySize(item)})` : ""}</h4>
                          <p className="text-sm text-muted-foreground">{getBrandName(brandId)} • {categoryName}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(pantryItem.itemId)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Quantidade</p>
                          <p className={`font-semibold ${lowStock ? 'text-destructive' : 'text-foreground'}`}>
                            {getPantryQuantityLabel(pantryItem, item)}
                          </p>
                          {lowStock && (
                            <span className="inline-block mt-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                              Estoque baixo
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-muted-foreground">Último Preço</p>
                          <p className="font-semibold text-foreground">
                            {pantryItem.lastPurchasePrice
                              ? `R$ ${pantryItem.lastPurchasePrice.toFixed(2)}`
                              : "—"}
                          </p>
                        </div>
                      </div>

                      {pantryItem.openedDate && (
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Aberto em: {formatStoredDate(pantryItem.openedDate)}
                          </p>
                          {oldProduct && (
                            <div className="mt-1 flex items-center gap-1 text-warning">
                              <AlertCircle className="h-3 w-3" />
                              <span className="text-xs">Aberto há mais de 30 dias</span>
                            </div>
                          )}
                        </div>
                      )}

                      {pantryItem.lastPurchaseStore && (
                        <p className="text-xs text-muted-foreground">
                          Último mercado: {pantryItem.lastPurchaseStore}
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          /* Empty State */
          <Card className="p-12">
            <div className="flex flex-col items-center text-center">
              <Package2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum item cadastrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Cadastre itens no app para começar a acompanhar sua despensa, mesmo quando a quantidade estiver zerada.
              </p>
              <Button onClick={() => window.location.href = "/items"}>
                Ir para Itens
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Edit Quantity Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Quantidade - {selectedItem?.name}{selectedItem && getItemDisplaySize(selectedItem) ? ` (${getItemDisplaySize(selectedItem)})` : ""}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Quantidade Atual</Label>
              <Input
                type="number"
                step="0.01"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Abertura (opcional)</Label>
              <Input
                type="date"
                value={editOpenedDate}
                onChange={(e) => setEditOpenedDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveQuantity}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
