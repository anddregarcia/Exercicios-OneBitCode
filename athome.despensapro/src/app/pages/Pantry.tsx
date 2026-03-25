import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { AlertCircle, Package2, Loader2 } from "lucide-react";
import { itemsAPI, pantryAPI, brandsAPI, unitsAPI, storesAPI, packagingsAPI, categoriesAPI, purchasesAPI } from "../lib/api";
import { toast } from "sonner";

export function Pantry() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pantryItems, setPantryItems] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [packagings, setPackagings] = useState<any[]>([]);
  const [draftPantryByItemId, setDraftPantryByItemId] = useState<Record<string, { currentQuantity: string; openedDate: string }>>({});

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
      setDraftPantryByItemId(
        Object.fromEntries(
          enrichedPantry.map((pantryItem: any) => [
            pantryItem.itemId,
            {
              currentQuantity: pantryItem.currentQuantity?.toString() ?? "0",
              openedDate: pantryItem.openedDate || "",
            },
          ])
        )
      );
    } catch (error) {
      console.error("Error loading pantry data:", error);
      toast.error("Erro ao carregar dados da despensa");
    } finally {
      setLoading(false);
    }
  };

  const handleDraftChange = (itemId: string, field: "currentQuantity" | "openedDate", value: string) => {
    setDraftPantryByItemId((prev) => ({
      ...prev,
      [itemId]: {
        currentQuantity: prev[itemId]?.currentQuantity ?? "0",
        openedDate: prev[itemId]?.openedDate ?? "",
        [field]: value,
      },
    }));
  };

  const getDirtyPantryUpdates = () => pantryItems.reduce<Array<{ itemId: string; currentQuantity: number; openedDate?: string }>>((acc, pantryItem) => {
    const draft = draftPantryByItemId[pantryItem.itemId];
    if (!draft) return acc;

    const parsedQuantity = Number.parseFloat(draft.currentQuantity);
    if (Number.isNaN(parsedQuantity)) return acc;

    const openedDate = draft.openedDate || "";
    const quantityChanged = parsedQuantity !== pantryItem.currentQuantity;
    const openedDateChanged = openedDate !== (pantryItem.openedDate || "");

    if (quantityChanged || openedDateChanged) {
      acc.push({
        itemId: pantryItem.itemId,
        currentQuantity: parsedQuantity,
        openedDate: openedDate || undefined,
      });
    }
    return acc;
  }, []);

  const hasPendingChanges = getDirtyPantryUpdates().length > 0;

  const handleSaveAllChanges = async () => {
    const dirtyUpdates = getDirtyPantryUpdates();
    if (!dirtyUpdates.length) {
      toast.info("Não há alterações pendentes");
      return;
    }

    const hasInvalidQuantity = Object.values(draftPantryByItemId).some((draft) => Number.isNaN(Number.parseFloat(draft.currentQuantity)));
    if (hasInvalidQuantity) {
      toast.error("Revise as quantidades informadas antes de salvar");
      return;
    }

    setSaving(true);
    try {
      await pantryAPI.updateMany(dirtyUpdates);
      setPantryItems((prev) => prev.map((pantryItem) => {
        const updated = dirtyUpdates.find((change) => change.itemId === pantryItem.itemId);
        return updated
          ? { ...pantryItem, currentQuantity: updated.currentQuantity, openedDate: updated.openedDate || "" }
          : pantryItem;
      }));
      toast.success("Alterações da despensa salvas com sucesso!");
    } catch (error) {
      console.error("Error updating pantry items:", error);
      toast.error("Erro ao salvar alterações");
    } finally {
      setSaving(false);
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
    const unit = getUnitAbbr(item.unitId);
    if (!packaging && unit) return unit;
    if (!packaging) return "";
    if (!item?.packageSize || !unit) return packaging;

    return `${packaging} de ${item.packageSize} ${unit}`;
  };

  const getPantryQuantityLabel = (pantryItem: any, item: any) => {
    const unit = getUnitAbbr(item.unitId);
    return unit
      ? `${pantryItem.currentQuantity} ${unit}`
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

  const isEssentialZero = (item: any, quantity: number) => Boolean(item?.isEssential) && quantity <= 0;

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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Gestão de Despensa</h1>
            <p className="mt-2 text-muted-foreground">
              Acompanhe o estoque e validade dos seus produtos
            </p>
          </div>
          <Button onClick={handleSaveAllChanges} disabled={!hasPendingChanges || saving}>
            {saving ? "Salvando alterações..." : "Salvar alterações da despensa"}
          </Button>
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
                    </tr>
                  </thead>
                  <tbody>
                    {expandedPantryRows.map(({ key, pantryItem, item, brandId, categoryName }) => {
                      const draft = draftPantryByItemId[pantryItem.itemId] || { currentQuantity: "0", openedDate: "" };
                      const draftQuantity = Number.parseFloat(draft.currentQuantity) || 0;
                      const lowStock = isLowStock(draftQuantity);
                      const oldProduct = isOldProduct(pantryItem.openedDate);
                      const essentialOutOfStock = isEssentialZero(item, draftQuantity);

                      return (
                        <tr key={key} className={`border-b border-border hover:bg-muted/30 ${essentialOutOfStock ? "bg-warning/10" : ""}`}>
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
                                {getPantryQuantityLabel({ ...pantryItem, currentQuantity: draftQuantity }, item)}
                              </span>
                              <Input
                                type="number"
                                step="0.01"
                                className="w-24"
                                value={draft.currentQuantity}
                                onChange={(e) => handleDraftChange(pantryItem.itemId, "currentQuantity", e.target.value)}
                              />
                              {lowStock && (
                                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                                  Estoque baixo
                                </span>
                              )}
                              {essentialOutOfStock && (
                                <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs text-warning-foreground">
                                  Essencial em falta
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">{formatStoredDate(draft.openedDate)}</p>
                              <Input
                                type="date"
                                value={draft.openedDate}
                                onChange={(e) => handleDraftChange(pantryItem.itemId, "openedDate", e.target.value)}
                              />
                            </div>
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
                            {essentialOutOfStock && (
                              <p className="text-xs text-warning-foreground">Item essencial zerado</p>
                            )}
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
                const draft = draftPantryByItemId[pantryItem.itemId] || { currentQuantity: "0", openedDate: "" };
                const draftQuantity = Number.parseFloat(draft.currentQuantity) || 0;
                const lowStock = isLowStock(draftQuantity);
                const oldProduct = isOldProduct(pantryItem.openedDate);
                const essentialOutOfStock = isEssentialZero(item, draftQuantity);

                return (
                  <Card key={key} className={`p-4 ${essentialOutOfStock ? "bg-warning/10" : ""}`}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{item.name}{getItemDisplaySize(item) ? ` (${getItemDisplaySize(item)})` : ""}</h4>
                          <p className="text-sm text-muted-foreground">{getBrandName(brandId)} • {categoryName}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Quantidade</p>
                          <p className={`font-semibold ${lowStock ? 'text-destructive' : 'text-foreground'}`}>
                            {getPantryQuantityLabel({ ...pantryItem, currentQuantity: draftQuantity }, item)}
                          </p>
                          <Input
                            type="number"
                            step="0.01"
                            value={draft.currentQuantity}
                            onChange={(e) => handleDraftChange(pantryItem.itemId, "currentQuantity", e.target.value)}
                          />
                          {lowStock && (
                            <span className="inline-block mt-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                              Estoque baixo
                            </span>
                          )}
                          {essentialOutOfStock && (
                            <span className="inline-block mt-1 rounded-full bg-warning/20 px-2 py-0.5 text-xs text-warning-foreground">
                              Essencial em falta
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

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Aberto em: {formatStoredDate(draft.openedDate)}
                        </p>
                        <Input
                          type="date"
                          value={draft.openedDate}
                          onChange={(e) => handleDraftChange(pantryItem.itemId, "openedDate", e.target.value)}
                        />
                        {oldProduct && (
                          <div className="mt-1 flex items-center gap-1 text-warning">
                            <AlertCircle className="h-3 w-3" />
                            <span className="text-xs">Aberto há mais de 30 dias</span>
                          </div>
                        )}
                        {essentialOutOfStock && (
                          <p className="mt-1 text-xs text-warning-foreground">Item essencial zerado</p>
                        )}
                      </div>
                      
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
    </div>
  );
}
