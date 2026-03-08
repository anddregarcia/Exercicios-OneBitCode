import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { itemsAPI, brandsAPI, categoriesAPI, unitsAPI, packagingsAPI } from "../lib/api";

interface QuickAddItemProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemCreated: (item: any) => void;
}

const sortByName = (list: any[]) => [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

export function QuickAddItem({ open, onOpenChange, onItemCreated }: QuickAddItemProps) {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [packagings, setPackagings] = useState<any[]>([]);

  const [itemName, setItemName] = useState("");
  const [brandIds, setBrandIds] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [packagingId, setPackagingId] = useState("");
  const [packageSize, setPackageSize] = useState("");
  const [isVegan, setIsVegan] = useState(false);

  const [showNewBrand, setShowNewBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandVegan, setNewBrandVegan] = useState(false);

  useEffect(() => {
    if (open) loadData();
  }, [open]);

  const loadData = async () => {
    try {
      const [brandsData, categoriesData, unitsData, packagingsData] = await Promise.all([
        brandsAPI.getAll(),
        categoriesAPI.getAll(),
        unitsAPI.getAll(),
        packagingsAPI.getAll(),
      ]);
      setBrands(sortByName(brandsData));
      setCategories(sortByName(categoriesData));
      setUnits(sortByName(unitsData));
      setPackagings(sortByName(packagingsData));
    } catch {
      toast.error("Erro ao carregar dados");
    }
  };

  const resetForm = () => {
    setItemName("");
    setBrandIds([]);
    setCategoryId("");
    setUnitId("");
    setPackagingId("");
    setPackageSize("");
    setIsVegan(false);
    setShowNewBrand(false);
    setNewBrandName("");
    setNewBrandVegan(false);
  };

  const handleQuickAddBrand = async () => {
    if (!newBrandName.trim()) return toast.error("Digite o nome da marca");
    try {
      const brand = await brandsAPI.create({ name: newBrandName, isVegan: newBrandVegan });
      const ordered = sortByName([...brands, brand]);
      setBrands(ordered);
      setBrandIds((prev) => [...prev, brand.id]);
      setShowNewBrand(false);
      setNewBrandName("");
      setNewBrandVegan(false);
      toast.success("Marca cadastrada!");
    } catch {
      toast.error("Erro ao cadastrar marca");
    }
  };

  const toggleBrand = (id: string, checked: boolean) => {
    setBrandIds((prev) => (checked ? [...prev, id] : prev.filter((brandId) => brandId !== id)));
  };

  const handleSave = async () => {
    if (!itemName.trim()) {
      return toast.error("Preencha o nome do item");
    }

    setLoading(true);
    try {
      const item = await itemsAPI.create({
        name: itemName.trim(),
        brandIds,
        categoryId,
        unitId,
        packagingId,
        packageSize,
        isVegan,
      });
      toast.success("Item cadastrado com sucesso!");
      onItemCreated(item);
      resetForm();
      onOpenChange(false);
    } catch {
      toast.error("Erro ao cadastrar item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Cadastro Rápido de Item</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2"><Label>Nome do Item *</Label><Input value={itemName} onChange={(e) => setItemName(e.target.value)} /></div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Marcas</Label>
              <Button variant="ghost" size="sm" onClick={() => setShowNewBrand(!showNewBrand)} type="button"><Plus className="h-4 w-4 mr-1" />Nova</Button>
            </div>
            {showNewBrand ? (
              <div className="rounded-lg border p-3 space-y-3 bg-muted/30">
                <Input value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} placeholder="Nome da marca" />
                <div className="flex items-center gap-2"><Checkbox id="new-brand-vegan" checked={newBrandVegan} onCheckedChange={(checked) => setNewBrandVegan(checked as boolean)} /><label htmlFor="new-brand-vegan" className="text-sm">Marca vegana</label></div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleQuickAddBrand} className="flex-1" type="button">Adicionar</Button>
                  <Button size="sm" variant="outline" onClick={() => setShowNewBrand(false)} type="button">Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="max-h-32 overflow-y-auto rounded-lg border p-3 space-y-2">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center gap-2">
                    <Checkbox id={`quick-brand-${brand.id}`} checked={brandIds.includes(brand.id)} onCheckedChange={(checked) => toggleBrand(brand.id, checked as boolean)} />
                    <label htmlFor={`quick-brand-${brand.id}`} className="text-sm cursor-pointer">{brand.name}</label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2"><Label>Categoria</Label><Select value={categoryId} onValueChange={setCategoryId}><SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Embalagem</Label><Select value={packagingId} onValueChange={setPackagingId}><SelectTrigger><SelectValue placeholder="Selecione a embalagem" /></SelectTrigger><SelectContent>{packagings.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Unidade</Label><Select value={unitId} onValueChange={setUnitId}><SelectTrigger><SelectValue placeholder="Selecione a unidade" /></SelectTrigger><SelectContent>{units.map((u) => <SelectItem key={u.id} value={u.id}>{u.name} ({u.abbreviation})</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Volume da Embalagem</Label><Input value={packageSize} type="number" step="0.01" onChange={(e) => setPackageSize(e.target.value)} /></div>
          <div className="flex items-center gap-2"><Checkbox id="quick-item-vegan" checked={isVegan} onCheckedChange={(checked) => setIsVegan(checked as boolean)} /><label htmlFor="quick-item-vegan" className="text-sm">Item vegano</label></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading}>{loading ? "Salvando..." : "Cadastrar Item"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
