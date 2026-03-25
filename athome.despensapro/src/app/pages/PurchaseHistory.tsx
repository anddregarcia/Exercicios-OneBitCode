import { useEffect, useMemo, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { itemsAPI, storesAPI, purchasesAPI } from "../lib/api";
import { toast } from "sonner";

interface PurchaseGroup {
  key: string;
  date: string;
  storeId: string;
  purchases: any[];
}

export function PurchaseHistory() {
  const [loading, setLoading] = useState(true);
  const [groupedPurchases, setGroupedPurchases] = useState<PurchaseGroup[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [expandedPurchases, setExpandedPurchases] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [purchases, itemsData, storesData] = await Promise.all([
          purchasesAPI.getAll(),
          itemsAPI.getAll(),
          storesAPI.getAll(),
        ]);

        const grouped = purchases.reduce((acc: Record<string, any[]>, purchase: any) => {
          const dateKey = new Date(purchase.date).toISOString().split("T")[0];
          const key = `${dateKey}:${purchase.storeId}`;
          if (!acc[key]) acc[key] = [];
          acc[key].push(purchase);
          return acc;
        }, {});

        const groupedList = Object.entries(grouped)
          .map(([key, purchaseGroup]) => {
            const [date, storeId] = key.split(":");
            return { key, date, storeId, purchases: purchaseGroup };
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setGroupedPurchases(groupedList);
        setItems(itemsData);
        setStores(storesData);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar histórico de compras");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getItemName = (itemId: string) => items.find((item) => item.id === itemId)?.name || "Item";
  const getStoreName = (storeId: string) => stores.find((store) => store.id === storeId)?.name || "Mercado";

  const getPurchaseTotal = (purchaseGroup: any[]) =>
    purchaseGroup.reduce((acc, purchase) => acc + Number(purchase.price) * Number(purchase.quantity), 0);

  const orderedGroups = useMemo(
    () =>
      [...groupedPurchases].sort((a, b) => {
        const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateComparison !== 0) return dateComparison;
        return getStoreName(a.storeId).localeCompare(getStoreName(b.storeId), "pt-BR");
      }),
    [groupedPurchases, stores]
  );
  const getPurchaseTotal = (date: string) =>
    groupedPurchases[date].reduce((acc, purchase) => acc + Number(purchase.price) * Number(purchase.quantity), 0);

  const togglePurchase = (groupKey: string) => {
    setExpandedPurchases((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
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
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Histórico de Compras</h1>
          <p className="mt-2 text-muted-foreground">Compras organizadas por data</p>
        </div>

        {orderedGroups.length === 0 && (
          <Card className="p-6 text-muted-foreground">Nenhuma compra registrada.</Card>
        )}

        {orderedGroups.map((group) => {
          const isExpanded = Boolean(expandedPurchases[group.key]);

          return (
            <Card key={group.key} className="p-4 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    {new Date(`${group.date}T00:00:00`).toLocaleDateString("pt-BR")} • {getStoreName(group.storeId)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Total da compra:{" "}
                    <span className="font-semibold text-foreground">R$ {getPurchaseTotal(group.purchases).toFixed(2)}</span>
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => togglePurchase(group.key)}>
                  {isExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                  {isExpanded ? "Recolher" : "Expandir"}
                </Button>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-3">
                  {group.purchases
                    .sort((a, b) => getItemName(a.itemId).localeCompare(getItemName(b.itemId), "pt-BR"))
                    .map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between border border-border rounded-lg p-3">
                        <div>
                          <p className="font-medium text-foreground">{getItemName(purchase.itemId)}</p>
                          <p className="text-sm text-muted-foreground">{getStoreName(purchase.storeId)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">R$ {purchase.price.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">Qtd: {purchase.quantity}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
