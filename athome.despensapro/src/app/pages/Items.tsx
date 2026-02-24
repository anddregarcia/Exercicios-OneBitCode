import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import {
  itemsAPI,
  brandsAPI,
  categoriesAPI,
  unitsAPI,
  storesAPI,
} from "../lib/api";
import { toast } from "sonner";

type EntityType = "item" | "brand" | "category" | "unit" | "store";

export function Items() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<EntityType>("item");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Data states
  const [items, setItems] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);

  // Item form state
  const [itemName, setItemName] = useState("");
  const [itemBrand, setItemBrand] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemUnit, setItemUnit] = useState("");
  const [itemPackageSize, setItemPackageSize] = useState("");
  const [itemVegan, setItemVegan] = useState(false);

  // Brand form state
  const [brandName, setBrandName] = useState("");
  const [brandVegan, setBrandVegan] = useState(false);

  // Category form state
  const [categoryName, setCategoryName] = useState("");

  // Unit form state
  const [unitName, setUnitName] = useState("");
  const [unitAbbreviation, setUnitAbbreviation] = useState("");

  // Store form state
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsData, brandsData, categoriesData, unitsData, storesData] = await Promise.all([
        itemsAPI.getAll(),
        brandsAPI.getAll(),
        categoriesAPI.getAll(),
        unitsAPI.getAll(),
        storesAPI.getAll(),
      ]);

      setItems(itemsData);
      setBrands(brandsData);
      setCategories(categoriesData);
      setUnits(unitsData);
      setStores(storesData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setItemName("");
    setItemBrand("");
    setItemCategory("");
    setItemUnit("");
    setItemPackageSize("");
    setItemVegan(false);
    setBrandName("");
    setBrandVegan(false);
    setCategoryName("");
    setUnitName("");
    setUnitAbbreviation("");
    setStoreName("");
    setStoreAddress("");
  };

  const handleAdd = (type: EntityType) => {
    setActiveTab(type);
    setEditMode(false);
    setEditingId(null);
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (type: EntityType, entity: any) => {
    setActiveTab(type);
    setEditMode(true);
    setEditingId(entity.id);

    if (type === "item") {
      setItemName(entity.name || "");
      setItemBrand(entity.brandId || "");
      setItemCategory(entity.categoryId || "");
      setItemUnit(entity.unitId || "");
      setItemPackageSize(entity.packageSize || "");
      setItemVegan(Boolean(entity.isVegan));
    }

    if (type === "brand") {
      setBrandName(entity.name || "");
      setBrandVegan(Boolean(entity.isVegan));
    }

    if (type === "category") {
      setCategoryName(entity.name || "");
    }

    if (type === "unit") {
      setUnitName(entity.name || "");
      setUnitAbbreviation(entity.abbreviation || "");
    }

    if (type === "store") {
      setStoreName(entity.name || "");
      setStoreAddress(entity.address || "");
    }

    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      switch (activeTab) {
        case "item":
          if (!itemName || !itemBrand || !itemCategory || !itemUnit || !itemPackageSize) {
            toast.error("Preencha todos os campos obrigatórios");
            return;
          }
          const itemPayload = {
            name: itemName,
            brandId: itemBrand,
            categoryId: itemCategory,
            unitId: itemUnit,
            packageSize: itemPackageSize,
            isVegan: itemVegan,
          };
          if (editMode && editingId) {
            const updatedItem = await itemsAPI.update(editingId, itemPayload);
            setItems(items.map((item) => (item.id === editingId ? updatedItem : item)));
            toast.success(`Item "${itemName}" atualizado com sucesso!`);
          } else {
            const newItem = await itemsAPI.create(itemPayload);
            setItems([...items, newItem]);
            toast.success(`Item "${itemName}" cadastrado com sucesso!`);
          }
          break;

        case "brand":
          if (!brandName) {
            toast.error("Preencha o nome da marca");
            return;
          }
          const brandPayload = { name: brandName, isVegan: brandVegan };
          if (editMode && editingId) {
            const updatedBrand = await brandsAPI.update(editingId, brandPayload);
            setBrands(brands.map((brand) => (brand.id === editingId ? updatedBrand : brand)));
            toast.success(`Marca "${brandName}" atualizada com sucesso!`);
          } else {
            const newBrand = await brandsAPI.create(brandPayload);
            setBrands([...brands, newBrand]);
            toast.success(`Marca "${brandName}" cadastrada com sucesso!`);
          }
          break;

        case "category":
          if (!categoryName) {
            toast.error("Preencha o nome da categoria");
            return;
          }
          const categoryPayload = { name: categoryName };
          if (editMode && editingId) {
            const updatedCategory = await categoriesAPI.update(editingId, categoryPayload);
            setCategories(categories.map((category) => (category.id === editingId ? updatedCategory : category)));
            toast.success(`Categoria "${categoryName}" atualizada com sucesso!`);
          } else {
            const newCategory = await categoriesAPI.create(categoryPayload);
            setCategories([...categories, newCategory]);
            toast.success(`Categoria "${categoryName}" cadastrada com sucesso!`);
          }
          break;

        case "unit":
          if (!unitName || !unitAbbreviation) {
            toast.error("Preencha todos os campos");
            return;
          }
          const unitPayload = { name: unitName, abbreviation: unitAbbreviation };
          if (editMode && editingId) {
            const updatedUnit = await unitsAPI.update(editingId, unitPayload);
            setUnits(units.map((unit) => (unit.id === editingId ? updatedUnit : unit)));
            toast.success(`Unidade "${unitName}" atualizada com sucesso!`);
          } else {
            const newUnit = await unitsAPI.create(unitPayload);
            setUnits([...units, newUnit]);
            toast.success(`Unidade "${unitName}" cadastrada com sucesso!`);
          }
          break;

        case "store":
          if (!storeName) {
            toast.error("Preencha o nome do mercado");
            return;
          }
          const storePayload = { name: storeName, address: storeAddress };
          if (editMode && editingId) {
            const updatedStore = await storesAPI.update(editingId, storePayload);
            setStores(stores.map((store) => (store.id === editingId ? updatedStore : store)));
            toast.success(`Mercado "${storeName}" atualizado com sucesso!`);
          } else {
            const newStore = await storesAPI.create(storePayload);
            setStores([...stores, newStore]);
            toast.success(`Mercado "${storeName}" cadastrado com sucesso!`);
          }
          break;
      }

      setDialogOpen(false);
      setEditMode(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Erro ao salvar");
    }
  };

  const handleDelete = async (type: EntityType, id: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      switch (type) {
        case "item":
          await itemsAPI.delete(id);
          setItems(items.filter(i => i.id !== id));
          toast.success("Item excluído");
          break;
        case "brand":
          await brandsAPI.delete(id);
          setBrands(brands.filter(b => b.id !== id));
          toast.success("Marca excluída");
          break;
        case "category":
          await categoriesAPI.delete(id);
          setCategories(categories.filter(c => c.id !== id));
          toast.success("Categoria excluída");
          break;
        case "unit":
          await unitsAPI.delete(id);
          setUnits(units.filter(u => u.id !== id));
          toast.success("Unidade excluída");
          break;
        case "store":
          await storesAPI.delete(id);
          setStores(stores.filter(s => s.id !== id));
          toast.success("Mercado excluído");
          break;
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Erro ao excluir");
    }
  };

  const getBrandName = (brandId: string) => brands.find(b => b.id === brandId)?.name || "";
  const getCategoryName = (categoryId: string) => categories.find(c => c.id === categoryId)?.name || "";
  const getUnitName = (unitId: string) => units.find((u) => u.id === unitId)?.abbreviation || "";

  const getDialogTitle = () => {
    const action = editMode ? "Editar" : "Novo";
    switch (activeTab) {
      case "item": return `${action} Item`;
      case "brand": return `${action} Marca`;
      case "category": return `${action} Categoria`;
      case "unit": return `${action} Unidade`;
      case "store": return `${action} Mercado`;
    }
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
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Cadastros</h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie itens, marcas, categorias e mercados
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EntityType)}>
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="item">Itens</TabsTrigger>
            <TabsTrigger value="brand">Marcas</TabsTrigger>
            <TabsTrigger value="category">Categorias</TabsTrigger>
            <TabsTrigger value="unit">Unidades</TabsTrigger>
            <TabsTrigger value="store">Mercados</TabsTrigger>
          </TabsList>

          {/* Items Tab */}
          <TabsContent value="item" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Itens Cadastrados</h3>
                <Button onClick={() => handleAdd("item")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Item
                </Button>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/30"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.name}{item.packageSize ? ` (${item.packageSize} ${getUnitName(item.unitId)})` : ""}</p>
                      <p className="text-sm text-muted-foreground">
                        {getBrandName(item.brandId)} • {getCategoryName(item.categoryId)}
                        {item.isVegan && " • Vegano"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit("item", item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete("item", item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Brands Tab */}
          <TabsContent value="brand" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Marcas Cadastradas</h3>
                <Button onClick={() => handleAdd("brand")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Marca
                </Button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/30"
                  >
                    <div>
                      <p className="font-medium text-foreground">{brand.name}</p>
                      {brand.isVegan && (
                        <p className="text-sm text-muted-foreground">Vegana</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit("brand", brand)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete("brand", brand.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="category" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Categorias Cadastradas</h3>
                <Button onClick={() => handleAdd("category")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Categoria
                </Button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/30"
                  >
                    <p className="font-medium text-foreground">{category.name}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit("category", category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete("category", category.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Units Tab */}
          <TabsContent value="unit" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Unidades Cadastradas</h3>
                <Button onClick={() => handleAdd("unit")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Unidade
                </Button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/30"
                  >
                    <div>
                      <p className="font-medium text-foreground">{unit.name}</p>
                      <p className="text-sm text-muted-foreground">{unit.abbreviation}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit("unit", unit)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete("unit", unit.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Stores Tab */}
          <TabsContent value="store" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Mercados Cadastrados</h3>
                <Button onClick={() => handleAdd("store")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Mercado
                </Button>
              </div>
              <div className="space-y-2">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/30"
                  >
                    <div>
                      <p className="font-medium text-foreground">{store.name}</p>
                      {store.address && (
                        <p className="text-sm text-muted-foreground">{store.address}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit("store", store)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete("store", store.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Item Form */}
            {activeTab === "item" && (
              <>
                <div className="space-y-2">
                  <Label>Nome do Item *</Label>
                  <Input
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Ex: Arroz Integral"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Marca *</Label>
                  <Select value={itemBrand} onValueChange={setItemBrand}>
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
                </div>
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select value={itemCategory} onValueChange={setItemCategory}>
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
                </div>
                <div className="space-y-2">
                  <Label>Unidade *</Label>
                  <Select value={itemUnit} onValueChange={setItemUnit}>
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
                <div className="space-y-2">
                  <Label>Volume da Embalagem *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemPackageSize}
                    onChange={(e) => setItemPackageSize(e.target.value)}
                    placeholder="Ex: 1, 0.5, 12"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vegan"
                    checked={itemVegan}
                    onCheckedChange={(checked) => setItemVegan(checked as boolean)}
                  />
                  <label htmlFor="vegan" className="text-sm cursor-pointer">
                    Item vegano
                  </label>
                </div>
              </>
            )}

            {/* Brand Form */}
            {activeTab === "brand" && (
              <>
                <div className="space-y-2">
                  <Label>Nome da Marca *</Label>
                  <Input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Ex: Taeq"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="brand-vegan"
                    checked={brandVegan}
                    onCheckedChange={(checked) => setBrandVegan(checked as boolean)}
                  />
                  <label htmlFor="brand-vegan" className="text-sm cursor-pointer">
                    Marca vegana
                  </label>
                </div>
              </>
            )}

            {/* Category Form */}
            {activeTab === "category" && (
              <div className="space-y-2">
                <Label>Nome da Categoria *</Label>
                <Input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Ex: Grãos e Cereais"
                />
              </div>
            )}

            {/* Unit Form */}
            {activeTab === "unit" && (
              <>
                <div className="space-y-2">
                  <Label>Nome da Unidade *</Label>
                  <Input
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    placeholder="Ex: Quilograma"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Abreviação *</Label>
                  <Input
                    value={unitAbbreviation}
                    onChange={(e) => setUnitAbbreviation(e.target.value)}
                    placeholder="Ex: kg"
                  />
                </div>
              </>
            )}

            {/* Store Form */}
            {activeTab === "store" && (
              <>
                <div className="space-y-2">
                  <Label>Nome do Mercado *</Label>
                  <Input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Ex: Pão de Açúcar"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Endereço (opcional)</Label>
                  <Input
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    placeholder="Ex: Av. Paulista, 1000"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editMode ? "Salvar Alterações" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
