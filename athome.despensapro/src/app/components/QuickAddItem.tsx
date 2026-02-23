import { useState, useEffect } from "react";
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
import { itemsAPI, brandsAPI, categoriesAPI, unitsAPI } from "../lib/api";

interface QuickAddItemProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemCreated: (item: any) => void;
}

export function QuickAddItem({ open, onOpenChange, onItemCreated }: QuickAddItemProps) {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  const [itemName, setItemName] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [isVegan, setIsVegan] = useState(false);

  // Quick add states
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandVegan, setNewBrandVegan] = useState(false);

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
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
      toast.error("Erro ao carregar dados");
    }
  };

  const handleQuickAddBrand = async () => {
    if (!newBrandName.trim()) {
      toast.error("Digite o nome da marca");
      return;
    }

    try {
      const brand = await brandsAPI.create({
        name: newBrandName,
        isVegan: newBrandVegan,
      });
      setBrands([...brands, brand]);
      setBrandId(brand.id);
      setShowNewBrand(false);
      setNewBrandName("");
      setNewBrandVegan(false);
      toast.success("Marca cadastrada!");
    } catch (error) {
      console.error("Error creating brand:", error);
      toast.error("Erro ao cadastrar marca");
    }
  };

  const handleQuickAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Digite o nome da categoria");
      return;
    }

    try {
      const category = await categoriesAPI.create({
        name: newCategoryName,
      });
      setCategories([...categories, category]);
      setCategoryId(category.id);
      setShowNewCategory(false);
      setNewCategoryName("");
      toast.success("Categoria cadastrada!");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Erro ao cadastrar categoria");
    }
  };

  const handleSave = async () => {
    if (!itemName.trim() || !brandId || !categoryId || !unitId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const item = await itemsAPI.create({
        name: itemName,
        brandId,
        categoryId,
        unitId,
        isVegan,
      });
      
      toast.success("Item cadastrado com sucesso!");
      onItemCreated(item);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating item:", error);
      toast.error("Erro ao cadastrar item");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setItemName("");
    setBrandId("");
    setCategoryId("");
    setUnitId("");
    setIsVegan(false);
    setShowNewBrand(false);
    setShowNewCategory(false);
    setNewBrandName("");
    setNewBrandVegan(false);
    setNewCategoryName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro Rápido de Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome do Item *</Label>
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Ex: Arroz Integral"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Marca *</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewBrand(!showNewBrand)}
                type="button"
              >
                <Plus className="h-4 w-4 mr-1" />
                Nova
              </Button>
            </div>
            
            {showNewBrand ? (
              <div className="rounded-lg border border-border p-3 space-y-3 bg-muted/30">
                <Input
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="Nome da marca"
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="quick-brand-vegan"
                    checked={newBrandVegan}
                    onCheckedChange={(checked) => setNewBrandVegan(checked as boolean)}
                  />
                  <label htmlFor="quick-brand-vegan" className="text-sm cursor-pointer">
                    Marca vegana
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleQuickAddBrand}
                    className="flex-1"
                    type="button"
                  >
                    Adicionar Marca
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowNewBrand(false)}
                    type="button"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Select value={brandId} onValueChange={setBrandId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Categoria *</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewCategory(!showNewCategory)}
                type="button"
              >
                <Plus className="h-4 w-4 mr-1" />
                Nova
              </Button>
            </div>
            
            {showNewCategory ? (
              <div className="rounded-lg border border-border p-3 space-y-3 bg-muted/30">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nome da categoria"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleQuickAddCategory}
                    className="flex-1"
                    type="button"
                  >
                    Adicionar Categoria
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowNewCategory(false)}
                    type="button"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>Unidade *</Label>
            <Select value={unitId} onValueChange={setUnitId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name} ({unit.abbreviation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="quick-item-vegan"
              checked={isVegan}
              onCheckedChange={(checked) => setIsVegan(checked as boolean)}
            />
            <label htmlFor="quick-item-vegan" className="text-sm cursor-pointer">
              Item vegano
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}