import { useEffect, useState } from "react";
import { seedData, itemsAPI } from "../lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DataInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAndInitialize();
  }, []);

  const checkAndInitialize = async () => {
    try {
      // Check if data exists
      const items = await itemsAPI.getAll();
      
      if (items.length === 0) {
        // No data, seed initial data
        console.log("No data found, seeding initial data...");
        await seedData();
        toast.success("Dados iniciais carregados com sucesso!");
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing data:", error);
      // Even if seeding fails, allow the app to continue
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando aplicação...</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-destructive">Erro ao inicializar dados</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
