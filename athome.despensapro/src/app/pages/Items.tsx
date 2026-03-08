import { useEffect, useMemo, useState } from "react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Edit, Info, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  brandsAPI,
  categoriesAPI,
  itemsAPI,
  packagingsAPI,
  storesAPI,
  unitsAPI,
} from "../lib/api";

type EntityType = "item" | "brand" | "category" | "packaging" | "unit" | "store";

const HELP_TEXTS: Record<EntityType, string> = {
  item: "Nesta tela você pode cadastrar todos os itens da sua despensa. Para aproveitar melhor o gerenciamento, prefira cadastrar o item com nome completo, marcas, embalagem, volume e unidade. Se quiser algo mais simples, também é possível cadastrar somente o nome.",
  brand: "Cadastre as marcas para associá-las aos itens e comparar os valores entre marcas diferentes.",
  category: "Cadastre categorias e relacione-as aos itens para facilitar o agrupamento durante novas compras.",
  unit: "Cadastre as unidades de medida para configurar corretamente embalagem, volume e unidade de cada item.",
  packaging: "Cadastre os tipos de embalagem e relacione-os aos itens para um gerenciamento mais detalhado da despensa.",
  store: "Cadastre os mercados em que você compra com frequência. Se quiser, adicione endereço para identificação. Esse cadastro é necessário para novas compras e comparação de gastos por mercado.",
};

const formatItemDetails = (item: any, units: any[], packagings: any[]) => {
  if (!item.packageSize) return "";
  const packaging = packagings.find((p) => p.id === item.packagingId)?.name;
  const unit = units.find((u) => u.id === item.unitId)?.abbreviation || units.find((u) => u.id === item.unitId)?.name;
  if (!packaging || !unit) return "";
  return ` (${packaging} de ${item.packageSize} ${unit})`;
};

export function Items() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<EntityType>(() => (localStorage.getItem("cadastros:active-tab") as EntityType) || "item");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [items, setItems] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [packagings, setPackagings] = useState<any[]>([]);

  const [itemName, setItemName] = useState("");
  const [itemBrandIds, setItemBrandIds] = useState<string[]>([]);
  const [itemCategory, setItemCategory] = useState("");
  const [itemUnit, setItemUnit] = useState("");
  const [itemPackaging, setItemPackaging] = useState("");
  const [itemPackageSize, setItemPackageSize] = useState("");
  const [itemVegan, setItemVegan] = useState(false);

  const [brandName, setBrandName] = useState("");
  const [brandVegan, setBrandVegan] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [unitName, setUnitName] = useState("");
  const [unitAbbreviation, setUnitAbbreviation] = useState("");
  const [packagingName, setPackagingName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem("cadastros:active-tab", activeTab);
  }, [activeTab]);

  const sortByName = (list: any[]) => [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsData, brandsData, categoriesData, unitsData, packagingsData, storesData] = await Promise.all([
        itemsAPI.getAll(),
        brandsAPI.getAll(),
        categoriesAPI.getAll(),
        unitsAPI.getAll(),
        packagingsAPI.getAll(),
        storesAPI.getAll(),
      ]);

      setItems(sortByName(itemsData));
      setBrands(sortByName(brandsData));
      setCategories(sortByName(categoriesData));
      setUnits(sortByName(unitsData));
      setPackagings(sortByName(packagingsData));
      setStores(sortByName(storesData));
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setItemName("");
    setItemBrandIds([]);
    setItemCategory("");
    setItemUnit("");
    setItemPackaging("");
    setItemPackageSize("");
    setItemVegan(false);

    setBrandName("");
    setBrandVegan(false);
    setCategoryName("");
    setUnitName("");
    setUnitAbbreviation("");
    setPackagingName("");
    setStoreName("");
    setStoreAddress("");
  };

  const openCreateDialog = (type: EntityType) => {
    setActiveTab(type);
    setEditMode(false);
    setEditingId(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (type: EntityType, entity: any) => {
    setActiveTab(type);
    setEditMode(true);
    setEditingId(entity.id);

    if (type === "item") {
      setItemName(entity.name || "");
      setItemBrandIds(entity.brandIds || (entity.brandId ? [entity.brandId] : []));
      setItemCategory(entity.categoryId || "");
      setItemUnit(entity.unitId || "");
      setItemPackaging(entity.packagingId || "");
      setItemPackageSize(entity.packageSize || "");
      setItemVegan(Boolean(entity.isVegan));
    }

    if (type === "brand") {
      setBrandName(entity.name || "");
      setBrandVegan(Boolean(entity.isVegan));
    }

    if (type === "category") setCategoryName(entity.name || "");
    if (type === "unit") {
      setUnitName(entity.name || "");
      setUnitAbbreviation(entity.abbreviation || "");
    }
    if (type === "packaging") setPackagingName(entity.name || "");
    if (type === "store") {
      setStoreName(entity.name || "");
      setStoreAddress(entity.address || "");
    }

    setDialogOpen(true);
  };

  const getBrandNames = (brandIds: string[]) =>
    brandIds
      .map((id) => brands.find((b) => b.id === id)?.name)
      .filter(Boolean)
      .join(", ");

  const toggleItemBrand = (brandId: string, checked: boolean) => {
    setItemBrandIds((prev) => (checked ? [...prev, brandId] : prev.filter((id) => id !== brandId)));
  };

  const handleSave = async () => {
    try {
      if (activeTab === "item") {
        if (!itemName.trim()) {
          toast.error("Preencha o nome do item");
          return;
        }
        const payload = {
          name: itemName.trim(),
          brandIds: itemBrandIds,
          categoryId: itemCategory,
          unitId: itemUnit,
          packagingId: itemPackaging,
          packageSize: itemPackageSize,
          isVegan: itemVegan,
        };
        if (editMode && editingId) {
          await itemsAPI.update(editingId, payload);
          toast.success("Item atualizado com sucesso");
        } else {
          await itemsAPI.create(payload);
          toast.success("Item cadastrado com sucesso");
        }
      }

      if (activeTab === "brand") {
        if (!brandName) return toast.error("Preencha o nome da marca");
        if (editMode && editingId) await brandsAPI.update(editingId, { name: brandName, isVegan: brandVegan });
        else await brandsAPI.create({ name: brandName, isVegan: brandVegan });
      }

      if (activeTab === "category") {
        if (!categoryName) return toast.error("Preencha o nome da categoria");
        if (editMode && editingId) await categoriesAPI.update(editingId, { name: categoryName });
        else await categoriesAPI.create({ name: categoryName });
      }

      if (activeTab === "packaging") {
        if (!packagingName) return toast.error("Preencha o nome da embalagem");
        if (editMode && editingId) await packagingsAPI.update(editingId, { name: packagingName });
        else await packagingsAPI.create({ name: packagingName });
      }

      if (activeTab === "unit") {
        if (!unitName || !unitAbbreviation) return toast.error("Preencha nome e abreviação");
        if (editMode && editingId) await unitsAPI.update(editingId, { name: unitName, abbreviation: unitAbbreviation });
        else await unitsAPI.create({ name: unitName, abbreviation: unitAbbreviation });
      }

      if (activeTab === "store") {
        if (!storeName) return toast.error("Preencha o nome do mercado");
        if (editMode && editingId) await storesAPI.update(editingId, { name: storeName, address: storeAddress });
        else await storesAPI.create({ name: storeName, address: storeAddress });
      }

      setDialogOpen(false);
      setEditMode(false);
      setEditingId(null);
      resetForm();
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar");
    }
  };

  const handleDelete = async (type: EntityType, id: string) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;
    try {
      if (type === "item") await itemsAPI.delete(id);
      if (type === "brand") await brandsAPI.delete(id);
      if (type === "category") await categoriesAPI.delete(id);
      if (type === "packaging") await packagingsAPI.delete(id);
      if (type === "unit") await unitsAPI.delete(id);
      if (type === "store") await storesAPI.delete(id);
      await loadData();
      toast.success("Registro excluído com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir");
    }
  };

  const dialogTitle = useMemo(() => {
    const action = editMode ? "Editar" : "Novo";
    if (activeTab === "item") return `${action} Item`;
    if (activeTab === "brand") return `${action} Marca`;
    if (activeTab === "category") return `${action} Categoria`;
    if (activeTab === "packaging") return `${action} Embalagem`;
    if (activeTab === "unit") return `${action} Unidade`;
    return `${action} Mercado`;
  }, [activeTab, editMode]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Cadastros</h1>
            <p className="mt-2 text-muted-foreground">Gerencie itens, marcas, categorias, embalagem, unidades e mercados.</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => setHelpOpen(true)} title="Ver instruções">
            <Info className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EntityType)}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 lg:w-auto">
            <TabsTrigger value="item">Itens</TabsTrigger>
            <TabsTrigger value="brand">Marcas</TabsTrigger>
            <TabsTrigger value="category">Categorias</TabsTrigger>
            <TabsTrigger value="packaging">Embalagem</TabsTrigger>
            <TabsTrigger value="unit">Unidades</TabsTrigger>
            <TabsTrigger value="store">Mercado</TabsTrigger>
          </TabsList>

          <TabsContent value="item" className="mt-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Itens Cadastrados</h3>
                <Button onClick={() => openCreateDialog("item")}><Plus className="h-4 w-4 mr-2" />Novo Item</Button>
              </div>
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium">{item.name}{formatItemDetails(item, units, packagings)}</p>
                    <p className="text-sm text-muted-foreground">{[getBrandNames(item.brandIds || []), categories.find((c) => c.id === item.categoryId)?.name || "Sem categoria", item.isVegan ? "Vegano" : ""].filter(Boolean).join(" • ")}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog("item", item)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete("item", item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>

          {([
            ["brand", "Marcas Cadastradas", brands],
            ["category", "Categorias Cadastradas", categories],
            ["packaging", "Embalagens Cadastradas", packagings],
            ["unit", "Unidades Cadastradas", units],
            ["store", "Mercados Cadastrados", stores],
          ] as [EntityType, string, any[]][]).map(([type, title, list]) => (
            <TabsContent key={type} value={type} className="mt-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <Button onClick={() => openCreateDialog(type)}><Plus className="h-4 w-4 mr-2" />Novo</Button>
                </div>
                {list.map((entity) => (
                  <div key={entity.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">{entity.name}</p>
                      {type === "unit" && <p className="text-sm text-muted-foreground">{entity.abbreviation}</p>}
                      {type === "store" && entity.address && <p className="text-sm text-muted-foreground">{entity.address}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(type, entity)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(type, entity.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{dialogTitle}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            {activeTab === "item" && (
              <>
                <div className="space-y-2"><Label>Nome do Item *</Label><Input value={itemName} onChange={(e) => setItemName(e.target.value)} /></div>
                <div className="space-y-2">
                  <Label>Marcas</Label>
                  <div className="max-h-40 overflow-y-auto rounded-md border p-3 space-y-2">
                    {brands.map((brand) => (
                      <div key={brand.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`brand-${brand.id}`}
                          checked={itemBrandIds.includes(brand.id)}
                          onCheckedChange={(checked) => toggleItemBrand(brand.id, checked as boolean)}
                        />
                        <label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">{brand.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2"><Label>Categoria</Label><Select value={itemCategory} onValueChange={setItemCategory}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Embalagem</Label><Select value={itemPackaging} onValueChange={setItemPackaging}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{packagings.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Unidade</Label><Select value={itemUnit} onValueChange={setItemUnit}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{units.map((u) => <SelectItem key={u.id} value={u.id}>{u.name} ({u.abbreviation})</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Volume da embalagem</Label><Input value={itemPackageSize} onChange={(e) => setItemPackageSize(e.target.value)} type="number" step="0.01" /></div>
                <div className="flex items-center gap-2"><Checkbox id="item-vegan" checked={itemVegan} onCheckedChange={(checked) => setItemVegan(checked as boolean)} /><label htmlFor="item-vegan" className="text-sm">Item vegano</label></div>
              </>
            )}
            {activeTab === "brand" && <><Label>Nome da Marca *</Label><Input value={brandName} onChange={(e) => setBrandName(e.target.value)} /><div className="flex items-center gap-2"><Checkbox id="brand-vegan" checked={brandVegan} onCheckedChange={(checked) => setBrandVegan(checked as boolean)} /><label htmlFor="brand-vegan" className="text-sm">Marca vegana</label></div></>}
            {activeTab === "category" && <><Label>Nome da Categoria *</Label><Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} /></>}
            {activeTab === "packaging" && <><Label>Nome da Embalagem *</Label><Input value={packagingName} onChange={(e) => setPackagingName(e.target.value)} /></>}
            {activeTab === "unit" && <><Label>Nome da Unidade *</Label><Input value={unitName} onChange={(e) => setUnitName(e.target.value)} /><Label>Abreviação *</Label><Input value={unitAbbreviation} onChange={(e) => setUnitAbbreviation(e.target.value)} /></>}
            {activeTab === "store" && <><Label>Nome do Mercado *</Label><Input value={storeName} onChange={(e) => setStoreName(e.target.value)} /><Label>Endereço</Label><Input value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} /></>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editMode ? "Salvar" : "Cadastrar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Instruções de cadastro</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{HELP_TEXTS[activeTab]}</p>
          <DialogFooter><Button onClick={() => setHelpOpen(false)}>Fechar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
