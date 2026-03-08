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

export interface Packaging {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  brandIds: string[];
  categoryId: string;
  unitId: string;
  packagingId: string;
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
  { id: "1", name: "Aurora", isVegan: false },
  { id: "2", name: "Coca-Cola", isVegan: true },
  { id: "3", name: "Nestlé", isVegan: false },
  { id: "4", name: "Piracanjuba", isVegan: false },
  { id: "5", name: "Qualitá", isVegan: false },
  { id: "6", name: "Taeq", isVegan: true },
  { id: "7", name: "Yoki", isVegan: true },
];

export const mockCategories: Category[] = [
  { id: "1", name: "Açougue" },
  { id: "2", name: "Bebidas" },
  { id: "3", name: "Congelados" },
  { id: "4", name: "Frios e Laticínios" },
  { id: "5", name: "Limpeza" },
  { id: "6", name: "Mercearia" },
  { id: "7", name: "Padaria" },
  { id: "8", name: "Pet" },
  { id: "9", name: "Higiene" },
  { id: "10", name: "Hortifruti" },
];

export const mockUnits: Unit[] = [
  { id: "1", name: "Quilograma", abbreviation: "kg" },
  { id: "2", name: "Grama", abbreviation: "g" },
  { id: "3", name: "Litro", abbreviation: "L" },
  { id: "4", name: "Mililitro", abbreviation: "ml" },
  { id: "5", name: "Unidade", abbreviation: "un" },
];

export const mockStores: Store[] = [
  { id: "1", name: "Atacadão", address: "Rod. Anhanguera, 1200" },
  { id: "2", name: "Carrefour", address: "Rua Augusta, 500" },
  { id: "3", name: "Extra", address: "Shopping Center Norte" },
  { id: "4", name: "Pão de Açúcar", address: "Av. Paulista, 1000" },
  { id: "5", name: "Assaí", address: "Av. Interlagos, 2300" },
];

export const mockPackagings: Packaging[] = [
  { id: "1", name: "Lata" },
  { id: "2", name: "Garrafa" },
  { id: "3", name: "Pacote" },
  { id: "4", name: "Vidro" },
  { id: "5", name: "Frasco" },
  { id: "6", name: "Caixa" },
  { id: "7", name: "Pote" },
];

export const mockItems: Item[] = [
  { id: "1", name: "Arroz", brandIds: ["5", "7"], categoryId: "6", unitId: "1", packagingId: "3", isVegan: true, packageSize: "5" },
  { id: "2", name: "Feijão Preto", brandIds: ["5", "7"], categoryId: "6", unitId: "1", packagingId: "3", isVegan: true, packageSize: "1" },
  { id: "3", name: "Leite Integral", brandIds: ["3", "4"], categoryId: "4", unitId: "3", packagingId: "2", isVegan: false, packageSize: "1" },
  { id: "4", name: "Refrigerante Cola", brandIds: ["2"], categoryId: "2", unitId: "3", packagingId: "2", isVegan: true, packageSize: "2" },
  { id: "5", name: "Detergente", brandIds: ["5"], categoryId: "5", unitId: "4", packagingId: "5", isVegan: true, packageSize: "500" },
  { id: "6", name: "Ração para Cães", brandIds: ["1"], categoryId: "8", unitId: "1", packagingId: "3", isVegan: false, packageSize: "10" },
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
