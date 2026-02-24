export interface Brand {
  id: string;
  name: string;
  isVegan: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Unit {
  id: string;
  name: string;
  abbreviation: string;
}

export interface Store {
  id: string;
  name: string;
  address?: string;
}

export interface Item {
  id: string;
  name: string;
  brandId: string;
  categoryId: string;
  unitId: string;
  isVegan: boolean;
  packageSize?: string;
}

export interface PurchaseHistory {
  id: string;
  itemId: string;
  storeId: string;
  price: number;
  quantity: number;
  date: string;
}

export interface PantryItem {
  itemId: string;
  currentQuantity: number;
  openedDate?: string;
  lastPurchasePrice?: number;
  lastPurchaseStore?: string;
}

// Mock Data
export const mockBrands: Brand[] = [
  { id: "1", name: "Taeq", isVegan: true },
  { id: "2", name: "Nestlé", isVegan: false },
  { id: "3", name: "Qualitá", isVegan: false },
  { id: "4", name: "Hellmann's", isVegan: false },
  { id: "5", name: "Açúcar União", isVegan: true },
];

export const mockCategories: Category[] = [
  { id: "1", name: "Grãos e Cereais" },
  { id: "2", name: "Laticínios" },
  { id: "3", name: "Condimentos" },
  { id: "4", name: "Bebidas" },
  { id: "5", name: "Limpeza" },
];

export const mockUnits: Unit[] = [
  { id: "1", name: "Quilograma", abbreviation: "kg" },
  { id: "2", name: "Litro", abbreviation: "L" },
  { id: "3", name: "Unidade", abbreviation: "un" },
  { id: "4", name: "Pacote", abbreviation: "pct" },
  { id: "5", name: "Caixa", abbreviation: "cx" },
];

export const mockStores: Store[] = [
  { id: "1", name: "Pão de Açúcar", address: "Av. Paulista, 1000" },
  { id: "2", name: "Carrefour", address: "Rua Augusta, 500" },
  { id: "3", name: "Extra", address: "Shopping Center Norte" },
  { id: "4", name: "Dia", address: "Rua da Consolação, 200" },
];

export const mockItems: Item[] = [
  { id: "1", name: "Arroz Integral", brandId: "1", categoryId: "1", unitId: "1", isVegan: true, packageSize: "1kg" },
  { id: "2", name: "Feijão Preto", brandId: "3", categoryId: "1", unitId: "1", isVegan: true, packageSize: "1kg" },
  { id: "3", name: "Leite Integral", brandId: "2", categoryId: "2", unitId: "2", isVegan: false, packageSize: "1L" },
  { id: "4", name: "Azeite de Oliva", brandId: "3", categoryId: "3", unitId: "2", isVegan: true, packageSize: "500ml" },
  { id: "5", name: "Maionese", brandId: "4", categoryId: "3", unitId: "4", isVegan: false, packageSize: "500g" },
  { id: "6", name: "Açúcar Refinado", brandId: "5", categoryId: "1", unitId: "1", isVegan: true, packageSize: "1kg" },
];

export const mockPurchaseHistory: PurchaseHistory[] = [
  { id: "1", itemId: "1", storeId: "1", price: 15.90, quantity: 1, date: "2026-02-15" },
  { id: "2", itemId: "1", storeId: "1", price: 16.50, quantity: 1, date: "2026-01-20" },
  { id: "3", itemId: "1", storeId: "2", price: 14.90, quantity: 1, date: "2026-01-10" },
  { id: "4", itemId: "2", storeId: "1", price: 8.90, quantity: 1, date: "2026-02-15" },
  { id: "5", itemId: "2", storeId: "2", price: 7.50, quantity: 1, date: "2026-01-25" },
  { id: "6", itemId: "3", storeId: "1", price: 5.50, quantity: 2, date: "2026-02-18" },
  { id: "7", itemId: "3", storeId: "1", price: 5.20, quantity: 2, date: "2026-02-05" },
  { id: "8", itemId: "4", storeId: "2", price: 28.90, quantity: 1, date: "2026-02-10" },
  { id: "9", itemId: "5", storeId: "1", price: 9.90, quantity: 1, date: "2026-02-15" },
  { id: "10", itemId: "6", storeId: "3", price: 4.50, quantity: 1, date: "2026-02-12" },
];

export const mockPantryItems: PantryItem[] = [
  { itemId: "1", currentQuantity: 0.5, lastPurchasePrice: 15.90, lastPurchaseStore: "Pão de Açúcar" },
  { itemId: "2", currentQuantity: 0.8, openedDate: "2026-02-10", lastPurchasePrice: 8.90, lastPurchaseStore: "Pão de Açúcar" },
  { itemId: "3", currentQuantity: 1.5, openedDate: "2026-02-18", lastPurchasePrice: 5.50, lastPurchaseStore: "Pão de Açúcar" },
  { itemId: "4", currentQuantity: 0.3, openedDate: "2026-01-20", lastPurchasePrice: 28.90, lastPurchaseStore: "Carrefour" },
  { itemId: "5", currentQuantity: 0, lastPurchasePrice: 9.90, lastPurchaseStore: "Pão de Açúcar" },
  { itemId: "6", currentQuantity: 0.2, lastPurchasePrice: 4.50, lastPurchaseStore: "Extra" },
];

// Helper functions
export function getItemById(id: string): Item | undefined {
  return mockItems.find(item => item.id === id);
}

export function getBrandById(id: string): Brand | undefined {
  return mockBrands.find(brand => brand.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return mockCategories.find(category => category.id === id);
}

export function getUnitById(id: string): Unit | undefined {
  return mockUnits.find(unit => unit.id === id);
}

export function getStoreById(id: string): Store | undefined {
  return mockStores.find(store => store.id === id);
}

export function getPurchaseHistoryByItem(itemId: string): PurchaseHistory[] {
  return mockPurchaseHistory
    .filter(purchase => purchase.itemId === itemId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAveragePrice(itemId: string): number {
  const history = getPurchaseHistoryByItem(itemId);
  if (history.length === 0) return 0;
  const sum = history.reduce((acc, purchase) => acc + purchase.price, 0);
  return sum / history.length;
}

export function getMinPrice(itemId: string): number {
  const history = getPurchaseHistoryByItem(itemId);
  if (history.length === 0) return 0;
  return Math.min(...history.map(p => p.price));
}

export function getMaxPrice(itemId: string): number {
  const history = getPurchaseHistoryByItem(itemId);
  if (history.length === 0) return 0;
  return Math.max(...history.map(p => p.price));
}

export function getPriceChange(itemId: string): number | null {
  const history = getPurchaseHistoryByItem(itemId);
  if (history.length < 2) return null;
  
  const latest = history[0].price;
  const previous = history[1].price;
  
  return ((latest - previous) / previous) * 100;
}
