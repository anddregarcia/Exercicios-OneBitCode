import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle2,
  Plus,
  Loader2
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { itemsAPI, storesAPI, purchasesAPI } from "../lib/api";
import { QuickAddItem } from "../components/QuickAddItem";
import { QuickAddStore } from "../components/QuickAddStore";
import { usePurchaseForm } from "../contexts/PurchaseFormContext";

interface PurchaseItem {
  itemId: string;
  selected: boolean;
  price: string;
  quantity: string;
}

export function NewPurchase() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  
  // Use purchase form context for persistence
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
  
  // Quick add dialogs
  const [quickAddItemOpen, setQuickAddItemOpen] = useState(false);
  const [quickAddStoreOpen, setQuickAddStoreOpen] = useState(false);
  const [groupByCategory, setGroupByCategory] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsData, storesData] = await Promise.all([
        itemsAPI.getAll(),
        storesAPI.getAll(),
      ]);

      const sortedItemsData = [...itemsData].sort((a: any, b: any) => a.name.localeCompare(b.name, "pt-BR"));
      setItems(sortedItemsData);
      setStores(storesData);
      
      // Only initialize purchase items if they are empty
      if (purchaseItems.length === 0) {
        setPurchaseItems(
          sortedItemsData.map((item: any) => ({
            itemId: item.id,
            selected: false,
            price: "",
            quantity: "",
          }))
        );
      } else {
        // Update purchase items to include new items if any
        const existingItemIds = new Set(purchaseItems.map(pi => pi.itemId));
        const newItems = itemsData
          .filter((item: any) => !existingItemIds.has(item.id))
          .map((item: any) => ({
            itemId: item.id,
            selected: false,
            price: "",
            quantity: "",
          }));
        
        if (newItems.length > 0) {
          setPurchaseItems([...purchaseItems, ...newItems]);
        }
      }

      // Load related data for display
      const brandsAPI = await import("../lib/api").then(m => m.brandsAPI);
      const categoriesAPI = await import("../lib/api").then(m => m.categoriesAPI);
      const unitsAPI = await import("../lib/api").then(m => m.unitsAPI);

      const [brandsData, categoriesData, unitsData] = await Promise.all([
        brandsAPI.getAll(),
        categoriesAPI.getAll(),
        unitsAPI.getAll(),
      ]);

      setBrands(brandsData);
      setCategories(categoriesData);
      setUnits(unitsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar dados. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    setPurchaseItems(prev =>
      prev.map(item =>
        item.itemId === itemId ? { ...item, selected: checked } : item
      )
    );
  };

  const handlePriceChange = (itemId: string, value: string) => {
    setPurchaseItems(prev =>
      prev.map(item =>
        item.itemId === itemId ? { ...item, price: value } : item
      )
    );
  };

  const handleQuantityChange = (itemId: string, value: string) => {
    setPurchaseItems(prev =>
      prev.map(item =>
        item.itemId === itemId ? { ...item, quantity: value } : item
      )
    );
  };

  const handleSavePurchase = async () => {
    if (!selectedStore) {
      toast.error("Selecione um mercado");
      return;
    }

    const selectedItems = purchaseItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      toast.error("Selecione pelo menos um item");
      return;
    }

    const invalidItems = selectedItems.filter(
      item => !item.price || !item.quantity || parseFloat(item.price) <= 0 || parseFloat(item.quantity) <= 0
    );

    if (invalidItems.length > 0) {
      toast.error("Preencha o preço e quantidade de todos os itens selecionados");
      return;
    }

    setSaving(true);
    try {
      await purchasesAPI.create({
        storeId: selectedStore,
        date: purchaseDate,
        items: selectedItems,
      });

      toast.success(`Compra registrada com sucesso! ${selectedItems.length} itens salvos.`);
      
      // Reset form
      clearForm();
    } catch (error) {
      console.error("Error saving purchase:", error);
      toast.error("Erro ao salvar compra");
    } finally {
      setSaving(false);
    }
  };

  const handleViewHistory = async (itemId: string) => {
    try {
      const history = await itemsAPI.getHistory(itemId);
      setItemHistory(history);
      setHistoryDialogItem(itemId);
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("Erro ao carregar histórico");
    }
  };

  const getPriceComparison = (itemId: string, currentPrice: string) => {
    if (!currentPrice || parseFloat(currentPrice) <= 0) return null;
    
    const price = parseFloat(currentPrice);
    const history = itemHistory.filter((h: any) => h.itemId === itemId);
    
    if (history.length === 0) return null;
    
    const prices = history.map((h: any) => h.price);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const minPrice = Math.min(...prices);
    
    const isMinPrice = price <= minPrice;
    const isAboveAverage = price > avgPrice;
    const percentDiff = ((price - avgPrice) / avgPrice) * 100;
    
    return { isMinPrice, isAboveAverage, percentDiff };
  };

  const getLastPrice = (itemId: string) => {
    const history = itemHistory.filter((h: any) => h.itemId === itemId);
    if (history.length === 0) return null;
    return history.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]?.price;
  };

  const getBrandName = (brandId: string) => {
    return brands.find(b => b.id === brandId)?.name || "";
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || "";
  };

  const getUnitName = (unitId: string) => {
    return units.find(u => u.id === unitId)?.abbreviation || "";
  };

  const getStoreName = (storeId: string) => {
    return stores.find(s => s.id === storeId)?.name || "";
  };

  const groupedItems = items.reduce((acc: Record<string, any[]>, item: any) => {
    const categoryName = getCategoryName(item.categoryId) || "Sem categoria";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(item);
    return acc;
  }, {});

  const orderedCategories = Object.keys(groupedItems).sort((a, b) => a.localeCompare(b, "pt-BR"));

  const handleItemCreated = (newItem: any) => {
    setItems([...items, newItem].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")));
    setPurchaseItems([
      ...purchaseItems,
      {
        itemId: newItem.id,
        selected: false,
        price: "",
        quantity: "",
      },
    ]);
  };

  const handleStoreCreated = (newStore: any) => {
    setStores([...stores, newStore]);
    setSelectedStore(newStore.id);
  };

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
          <h1 className="text-3xl font-semibold text-foreground">Nova Compra</h1>
          <p className="mt-2 text-muted-foreground">
            Registre os itens comprados e seus preços
          </p>
        </div>

        {/* Purchase Form */}
        <Card className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Mercado</Label>
              <div className="flex gap-2">
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o mercado" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map(store => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuickAddStoreOpen(true)}
                  title="Cadastrar novo mercado"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Data da Compra</Label>
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleSavePurchase} 
                className="w-full"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Compra"
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Add Item Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => setQuickAddItemOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Novo Item
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="group-by-category"
            checked={groupByCategory}
            onCheckedChange={(checked) => setGroupByCategory(checked as boolean)}
          />
          <Label htmlFor="group-by-category" className="cursor-pointer">
            Agrupar itens por categoria
          </Label>
        </div>

        {/* Items Table - Desktop */}
        <Card className="hidden md:block overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Comprou?
                  </th>
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
                    Preço (R$)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Quantidade
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Análise
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {!groupByCategory && items.map((item) => {
                  const purchaseItem = purchaseItems.find(p => p.itemId === item.id)!;
                  const comparison = getPriceComparison(item.id, purchaseItem?.price || "");
                  const lastPrice = getLastPrice(item.id);

                  return (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <Checkbox
                          checked={purchaseItem?.selected || false}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(item.id, checked as boolean)
                          }
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium text-foreground">{item.name}{item.packageSize ? ` (${item.packageSize} ${getUnitName(item.unitId)})` : ""}</span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{getBrandName(item.brandId)}</td>
                      <td className="px-4 py-4 text-muted-foreground">{getCategoryName(item.categoryId)}</td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <Input type="number" step="0.01" placeholder="0.00" value={purchaseItem?.price || ""} onChange={(e) => handlePriceChange(item.id, e.target.value)} className="w-24" />
                          {lastPrice && (<span className="text-xs text-muted-foreground">Último: R$ {lastPrice.toFixed(2)}</span>)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Input type="number" step="0.01" placeholder="0" value={purchaseItem?.quantity || ""} onChange={(e) => handleQuantityChange(item.id, e.target.value)} className="w-20" />
                      </td>
                      <td className="px-4 py-4">{comparison && (<div className="space-y-1">{comparison.isMinPrice ? (<div className="flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-3 w-3" /><span>Menor preço</span></div>) : comparison.isAboveAverage ? (<div className="flex items-center gap-1 text-xs text-warning"><AlertCircle className="h-3 w-3" /><span>+{comparison.percentDiff.toFixed(0)}% da média</span></div>) : null}</div>)}</td>
                      <td className="px-4 py-4"><Button variant="ghost" size="sm" onClick={() => handleViewHistory(item.id)}><History className="h-4 w-4 mr-1" />Histórico</Button></td>
                    </tr>
                  );
                })}

                {groupByCategory && orderedCategories.map((categoryName) => (
                  <>
                    <tr key={`header-${categoryName}`} className="border-b border-border bg-muted/50">
                      <td colSpan={8} className="px-4 py-2 font-semibold">{categoryName}</td>
                    </tr>
                    {groupedItems[categoryName]
                      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
                      .map((item: any) => {
                        const purchaseItem = purchaseItems.find(p => p.itemId === item.id)!;
                        const comparison = getPriceComparison(item.id, purchaseItem?.price || "");
                        const lastPrice = getLastPrice(item.id);

                        return (
                          <tr key={item.id} className="border-b border-border hover:bg-muted/30">
                            <td className="px-4 py-4"><Checkbox checked={purchaseItem?.selected || false} onCheckedChange={(checked) => handleCheckboxChange(item.id, checked as boolean)} /></td>
                            <td className="px-4 py-4"><span className="font-medium text-foreground">{item.name}{item.packageSize ? ` (${item.packageSize} ${getUnitName(item.unitId)})` : ""}</span></td>
                            <td className="px-4 py-4 text-muted-foreground">{getBrandName(item.brandId)}</td>
                            <td className="px-4 py-4 text-muted-foreground">{getCategoryName(item.categoryId)}</td>
                            <td className="px-4 py-4"><div className="space-y-1"><Input type="number" step="0.01" placeholder="0.00" value={purchaseItem?.price || ""} onChange={(e) => handlePriceChange(item.id, e.target.value)} className="w-24" />{lastPrice && (<span className="text-xs text-muted-foreground">Último: R$ {lastPrice.toFixed(2)}</span>)}</div></td>
                            <td className="px-4 py-4"><Input type="number" step="0.01" placeholder="0" value={purchaseItem?.quantity || ""} onChange={(e) => handleQuantityChange(item.id, e.target.value)} className="w-20" /></td>
                            <td className="px-4 py-4">{comparison && (<div className="space-y-1">{comparison.isMinPrice ? (<div className="flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-3 w-3" /><span>Menor preço</span></div>) : comparison.isAboveAverage ? (<div className="flex items-center gap-1 text-xs text-warning"><AlertCircle className="h-3 w-3" /><span>+{comparison.percentDiff.toFixed(0)}% da média</span></div>) : null}</div>)}</td>
                            <td className="px-4 py-4"><Button variant="ghost" size="sm" onClick={() => handleViewHistory(item.id)}><History className="h-4 w-4 mr-1" />Histórico</Button></td>
                          </tr>
                        );
                      })}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Items List - Mobile */}
        <div className="space-y-4 md:hidden">
          {items.map((item) => {
            const purchaseItem = purchaseItems.find(p => p.itemId === item.id)!;
            const comparison = getPriceComparison(item.id, purchaseItem?.price || "");
            const lastPrice = getLastPrice(item.id);

            return (
              <Card key={item.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={purchaseItem?.selected || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(item.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{item.name}{item.packageSize ? ` (${item.packageSize} ${getUnitName(item.unitId)})` : ""}</h4>
                      <p className="text-sm text-muted-foreground">
                        {getBrandName(item.brandId)} • {getCategoryName(item.categoryId)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Preço (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={purchaseItem?.price || ""}
                          onChange={(e) => handlePriceChange(item.id, e.target.value)}
                        />
                        {lastPrice && (
                          <span className="text-xs text-muted-foreground">
                            Último: R$ {lastPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Quantidade</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0"
                          value={purchaseItem?.quantity || ""}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        />
                      </div>
                    </div>

                    {comparison && (
                      <div className="space-y-1">
                        {comparison.isMinPrice ? (
                          <div className="flex items-center gap-1 text-xs text-success">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Menor preço histórico</span>
                          </div>
                        ) : comparison.isAboveAverage ? (
                          <div className="flex items-center gap-1 text-xs text-warning">
                            <AlertCircle className="h-3 w-3" />
                            <span>+{comparison.percentDiff.toFixed(0)}% acima da média</span>
                          </div>
                        ) : null}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewHistory(item.id)}
                      className="w-full"
                    >
                      <History className="h-4 w-4 mr-2" />
                      Ver Histórico
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* History Dialog */}
      <Dialog
        open={historyDialogItem !== null}
        onOpenChange={(open) => !open && setHistoryDialogItem(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Histórico de Preços -{" "}
              {historyDialogItem && items.find(i => i.id === historyDialogItem)?.name}{historyDialogItem && items.find(i => i.id === historyDialogItem)?.packageSize ? ` (${items.find(i => i.id === historyDialogItem)?.packageSize})` : ""}
            </DialogTitle>
          </DialogHeader>

          {historyDialogItem && (
            <div className="space-y-6">
              {/* Price Chart */}
              {itemHistory.length > 0 ? (
                <>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={itemHistory
                          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                          .map((p: any) => ({
                            date: new Date(p.date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                            }),
                            price: p.price,
                          }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Preço']}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#0d9488"
                          strokeWidth={2}
                          dot={{ fill: '#0d9488', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Purchase History List */}
                  <div>
                    <h4 className="font-semibold mb-3">Compras Anteriores</h4>
                    <div className="space-y-2">
                      {itemHistory
                        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((purchase: any, index: number) => {
                          const sortedHistory = itemHistory.sort((a: any, b: any) => 
                            new Date(b.date).getTime() - new Date(a.date).getTime()
                          );
                          const priceChange = index < sortedHistory.length - 1
                            ? purchase.price - sortedHistory[index + 1].price
                            : 0;

                          return (
                            <div
                              key={purchase.id}
                              className="flex items-center justify-between rounded-lg border border-border p-3"
                            >
                              <div>
                                <p className="font-medium text-foreground">
                                  {getStoreName(purchase.storeId)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(purchase.date).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground">
                                  R$ {purchase.price.toFixed(2)}
                                </p>
                                {priceChange !== 0 && (
                                  <div className={`flex items-center gap-1 text-xs ${
                                    priceChange > 0 ? 'text-destructive' : 'text-success'
                                  }`}>
                                    {priceChange > 0 ? (
                                      <TrendingUp className="h-3 w-3" />
                                    ) : (
                                      <TrendingDown className="h-3 w-3" />
                                    )}
                                    <span>
                                      {priceChange > 0 ? '+' : ''}
                                      R$ {Math.abs(priceChange).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum histórico de compras para este item
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Add Dialogs */}
      <QuickAddItem
        open={quickAddItemOpen}
        onOpenChange={setQuickAddItemOpen}
        onItemCreated={handleItemCreated}
      />

      <QuickAddStore
        open={quickAddStoreOpen}
        onOpenChange={setQuickAddStoreOpen}
        onStoreCreated={handleStoreCreated}
      />
    </div>
  );
}