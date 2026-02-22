import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { storesAPI } from "../lib/api";

interface QuickAddStoreProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStoreCreated: (store: any) => void;
}

export function QuickAddStore({ open, onOpenChange, onStoreCreated }: QuickAddStoreProps) {
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  const handleSave = async () => {
    if (!storeName.trim()) {
      toast.error("Digite o nome do mercado");
      return;
    }

    setLoading(true);
    try {
      const store = await storesAPI.create({
        name: storeName,
        address: storeAddress,
      });
      
      toast.success("Mercado cadastrado com sucesso!");
      onStoreCreated(store);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating store:", error);
      toast.error("Erro ao cadastrar mercado");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStoreName("");
    setStoreAddress("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastro Rápido de Mercado</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome do Mercado *</Label>
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Ex: Pão de Açúcar"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Endereço (opcional)</Label>
            <Input
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              placeholder="Ex: Av. Paulista, 1000"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar Mercado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
