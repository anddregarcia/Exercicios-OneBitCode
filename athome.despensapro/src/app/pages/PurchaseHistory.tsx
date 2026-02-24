import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Loader2 } from "lucide-react";
import { itemsAPI, storesAPI, purchasesAPI } from "../lib/api";
import { toast } from "sonner";

export function PurchaseHistory() {
  const [loading, setLoading] = useState(true);
  const [groupedPurchases, setGroupedPurchases] = useState<Record<string, any[]>>({});
  const [items, setItems] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);

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
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(purchase);
          return acc;
        }, {});

        setGroupedPurchases(grouped);
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

  const orderedDates = Object.keys(groupedPurchases).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

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

        {orderedDates.length === 0 && (
          <Card className="p-6 text-muted-foreground">Nenhuma compra registrada.</Card>
        )}

        {orderedDates.map((date) => (
          <Card key={date} className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR")}
            </h2>

            <div className="space-y-3">
              {groupedPurchases[date]
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
          </Card>
        ))}
      </div>
    </div>
  );
}
