import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Store,
  DollarSign,
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
import {
  itemsAPI,
  storesAPI,
  purchasesAPI,
} from "../lib/api";
import { toast } from "sonner";

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [purchaseItems, setPurchaseItems] = useState<any[]>([]);

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

      setItems(itemsData);
      setStores(storesData);

      // Load all purchase items
      const allHistory = await Promise.all(
        itemsData.map((item: any) => itemsAPI.getHistory(item.id))
      );
      
      const flatHistory = allHistory.flat();
      setPurchaseItems(flatHistory);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Calculate month statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthPurchases = purchaseItems.filter((purchase: any) => {
    const purchaseDate = new Date(purchase.date);
    return purchaseDate.getMonth() === currentMonth && purchaseDate.getFullYear() === currentYear;
  });

  const totalSpent = monthPurchases.reduce((sum: number, purchase: any) => 
    sum + (purchase.price * purchase.quantity), 0
  );
  const totalShoppingTrips = new Set(monthPurchases.map((purchase: any) => `${purchase.date}-${purchase.storeId}`)).size;
  const totalItemsPurchased = monthPurchases.reduce((sum: number, purchase: any) => sum + purchase.quantity, 0);

  // Most used store
  const storeFrequency = monthPurchases.reduce((acc: Record<string, number>, purchase: any) => {
    acc[purchase.storeId] = (acc[purchase.storeId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostUsedStoreId = Object.entries(storeFrequency).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mostUsedStore = mostUsedStoreId 
    ? stores.find(s => s.id === mostUsedStoreId)?.name 
    : "N/A";

  // Items with price increase
  const itemsWithIncrease = items
    .map((item: any) => {
      const history = purchaseItems
        .filter((p: any) => p.itemId === item.id)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (history.length < 2) return null;
      
      const latest = history[0].price;
      const previous = history[1].price;
      const change = ((latest - previous) / previous) * 100;
      
      return change > 0 ? { item, change, avgPrice: latest } : null;
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.change - a.change)
    .slice(0, 5);

  // Items with lowest historical price
  const itemsWithLowestPrice = items
    .map((item: any) => {
      const history = purchaseItems.filter((p: any) => p.itemId === item.id);
      if (history.length === 0) return null;
      
      const latestPurchase = history.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
      
      const minPrice = Math.min(...history.map((p: any) => p.price));
      const isLowest = latestPurchase.price === minPrice;
      
      return isLowest ? { item, currentPrice: latestPurchase.price } : null;
    })
    .filter(Boolean)
    .slice(0, 5);

  // Chart data for last 6 months
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      month: date.toLocaleDateString('pt-BR', { month: 'short' }),
      monthNum: date.getMonth(),
      year: date.getFullYear(),
    };
  });

  const chartData = last6Months.map(({ month, monthNum, year }) => {
    const purchases = purchaseItems.filter((purchase: any) => {
      const purchaseDate = new Date(purchase.date);
      return purchaseDate.getMonth() === monthNum && purchaseDate.getFullYear() === year;
    });
    
    const total = purchases.reduce((sum: number, purchase: any) => 
      sum + (purchase.price * purchase.quantity), 0
    );
    
    return { month, value: total };
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Visão geral das suas compras e despensa
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Gasto (Mês)</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">
                  R$ {totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compras Realizadas no Mês</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">{totalShoppingTrips}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>


          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Itens Comprados no Mês</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">{totalItemsPurchased}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mercado Favorito</p>
                <p className="mt-2 text-xl font-semibold text-foreground">{mostUsedStore}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Store className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts and Lists */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Price Increases */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Maiores Aumentos de Preço
            </h3>
            <div className="space-y-4">
              {itemsWithIncrease.length > 0 ? (
                itemsWithIncrease.map((data: any) => (
                  <div key={data.item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{data.item.name}{data.item.packageSize ? ` (${data.item.packageSize})` : ""}</p>
                      <p className="text-sm text-muted-foreground">
                        Preço atual: R$ {data.avgPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-destructive">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-semibold">+{data.change.toFixed(1)}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Nenhum aumento registrado</p>
              )}
            </div>
          </Card>

          {/* Lowest Prices */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Menores Preços Históricos
            </h3>
            <div className="space-y-4">
              {itemsWithLowestPrice.length > 0 ? (
                itemsWithLowestPrice.map((data: any) => (
                  <div key={data.item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{data.item.name}{data.item.packageSize ? ` (${data.item.packageSize})` : ""}</p>
                      <p className="text-sm text-muted-foreground">
                        Preço: R$ {data.currentPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-success">
                      <TrendingDown className="h-4 w-4" />
                      <span className="text-xs font-semibold bg-success/10 px-2 py-1 rounded">
                        Melhor preço
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Nenhum item encontrado</p>
              )}
            </div>
          </Card>
        </div>

        {/* Spending Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Evolução de Gastos (últimos 6 meses)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Total']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0d9488" 
                  strokeWidth={3}
                  dot={{ fill: '#0d9488', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
