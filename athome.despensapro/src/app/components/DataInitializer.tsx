import { useEffect, useState } from "react";
import { seedData, itemsAPI } from "../lib/api";
import { publicAnonKey } from "/utils/supabase/info";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

export function DataInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const { session } = useAuth();

  useEffect(() => {
    checkAndInitialize();
  }, [retryCount, session]);

  const checkAndInitialize = async () => {
    setIsLoading(true);
    setError(null);
    
    // Don't attempt to call the API if we're not authenticated yet or
    // the session only contains the anon key.  `supabase-js` often
    // returns a non-null session object even when nobody is signed in –
    // the token will just be the public anon key and `session.user` may
    // be null or even a placeholder object.  Avoid both situations.
    if (
      !session ||
      !session.access_token ||
      session.access_token === publicAnonKey ||
      !session.user
    ) {
      setIsInitialized(true);
      setIsLoading(false);
      return;
    }

    try {
      console.log("[DataInitializer] Checking for existing data...");
      
      // Try to fetch items with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const items = await itemsAPI.getAll();
        clearTimeout(timeoutId);
        console.log("[DataInitializer] Found items:", items.length);
        
        if (items.length === 0) {
          // No data, seed initial data
          console.log("[DataInitializer] No data found, seeding initial data...");
          await seedData();
          console.log("[DataInitializer] Seeding complete!");
          toast.success("Dados iniciais carregados com sucesso!");
        }
        
        setIsInitialized(true);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error: any) {
      console.error("[DataInitializer] Error initializing data:", error);
      
      // if the API call already logged us out, avoid showing the
      // connection dialog (ProtectedRoute will redirect to login)
      if (error.message?.includes("HTTP 401")) {
        return;
      }

      // Check if it's a network error
      if (error.message?.includes("Failed to fetch") || error.name === 'AbortError') {
        setError("O servidor está iniciando. Aguarde alguns segundos e clique em 'Tentar Novamente'.");
      } else {
        setError(`Erro ao carregar dados: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            {retryCount > 0 ? "Tentando reconectar..." : "Carregando aplicação..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Erro de Conexão</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => setRetryCount(retryCount + 1)}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}