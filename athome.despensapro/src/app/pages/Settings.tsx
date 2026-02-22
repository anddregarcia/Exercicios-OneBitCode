import { Card } from "../components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export function Settings() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Configurações</h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie suas preferências e configurações
          </p>
        </div>

        <Card className="p-12">
          <div className="flex flex-col items-center text-center">
            <SettingsIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Em breve
            </h3>
            <p className="text-muted-foreground">
              Página de configurações em desenvolvimento
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
