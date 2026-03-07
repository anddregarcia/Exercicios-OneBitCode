import { supabase } from "../contexts/AuthContext";
import {
  mockBrands,
  mockCategories,
  mockItems,
  mockPantryItems,
  mockStores,
  mockUnits,
  mockPackagings,
} from "./mockData";

type Brand = { id: string; name: string; isVegan: boolean };
type Category = { id: string; name: string };
type Unit = { id: string; name: string; abbreviation: string };
type Store = { id: string; name: string; address?: string };
type Packaging = { id: string; name: string };
type Item = {
  id: string;
  name: string;
  brandIds: string[];
  categoryId: string;
  unitId: string;
  packagingId: string;
  isVegan: boolean;
  packageSize?: string;
};
type PurchaseItem = {
  id: string;
  itemId: string;
  brandId?: string;
  storeId: string;
  price: number;
  quantity: number;
  date: string;
};
type PantryItem = {
  itemId: string;
  currentQuantity: number;
  openedDate?: string;
  lastPurchasePrice?: number;
  lastPurchaseStore?: string;
};

type UserData = {
  brands: Brand[];
  categories: Category[];
  units: Unit[];
  stores: Store[];
  packagings: Packaging[];
  items: Item[];
  purchases: PurchaseItem[];
  pantry: PantryItem[];
  seeded: boolean;
};

const STORAGE_PREFIX = "despensapro:user:";
const USER_DATA_METADATA_KEY = "despensaproData";

const sortByName = <T extends { name: string }>(list: T[]) =>
  [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

const normalizeItem = (item: any): Item => {
  const incomingBrandIds = Array.isArray(item?.brandIds)
    ? item.brandIds.filter(Boolean)
    : item?.brandId
      ? [item.brandId]
      : [];

  return {
    ...item,
    brandIds: incomingBrandIds,
    packageSize: item?.packageSize?.toString().trim() || "",
    packagingId: item?.packagingId || "",
  };
};

const normalizeUserData = (data: UserData): UserData => {
  if (!data.packagings || data.packagings.length === 0) {
    data.packagings = [...mockPackagings];
  }

  data.items = (data.items || []).map(normalizeItem);

  return data;
};

async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return user;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) return session.user;

  throw new Error("Usuário não autenticado");
}

function getStorageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

function createInitialData(): UserData {
  return {
    brands: sortByName([...mockBrands]),
    categories: sortByName([...mockCategories]),
    units: sortByName([...mockUnits]),
    stores: sortByName([...mockStores]),
    packagings: sortByName([...mockPackagings]),
    items: sortByName([...mockItems].map(normalizeItem)),
    purchases: [],
    pantry: [...mockPantryItems],
    seeded: true,
  };
}

function readLocalUserData(userId: string): UserData | null {
  const raw = localStorage.getItem(getStorageKey(userId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserData;
  } catch {
    return null;
  }
}

async function readUserData(): Promise<UserData> {
  const user = await getCurrentUser();
  const userId = user.id;
  const localData = readLocalUserData(userId);
  const cloudData = user.user_metadata?.[USER_DATA_METADATA_KEY] as UserData | undefined;

  if (cloudData) {
    const normalized = normalizeUserData(cloudData);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(normalized));
    return normalized;
  }

  if (localData) {
    const normalized = normalizeUserData(localData);
    await writeUserData(normalized);
    return normalized;
  }

  const initial = createInitialData();
  await writeUserData(initial);
  return initial;
}

async function writeUserData(data: UserData) {
  const user = await getCurrentUser();
  const currentMetadata = user.user_metadata || {};

  const { error } = await supabase.auth.updateUser({
    data: {
      ...currentMetadata,
      [USER_DATA_METADATA_KEY]: data,
    },
  });

  if (error) throw error;

  localStorage.setItem(getStorageKey(user.id), JSON.stringify(data));
}

function id() {
  return crypto.randomUUID();
}

export const brandsAPI = {
  getAll: async () => sortByName((await readUserData()).brands),
  create: async (brand: { name: string; isVegan: boolean }) => {
    const data = await readUserData();
    const newBrand = { id: id(), ...brand };
    data.brands.push(newBrand);
    await writeUserData(data);
    return newBrand;
  },
  delete: async (brandId: string) => {
    const data = await readUserData();
    data.brands = data.brands.filter((b) => b.id !== brandId);
    data.items = data.items.map((item) => ({
      ...item,
      brandIds: item.brandIds.filter((id) => id !== brandId),
    }));
    await writeUserData(data);
  },
  update: async (brandId: string, changes: { name: string; isVegan: boolean }) => {
    const data = await readUserData();
    data.brands = data.brands.map((brand) =>
      brand.id === brandId ? { ...brand, ...changes } : brand
    );
    await writeUserData(data);
    return data.brands.find((brand) => brand.id === brandId);
  },
};

export const categoriesAPI = {
  getAll: async () => sortByName((await readUserData()).categories),
  create: async (category: { name: string }) => {
    const data = await readUserData();
    const newCategory = { id: id(), ...category };
    data.categories.push(newCategory);
    await writeUserData(data);
    return newCategory;
  },
  delete: async (categoryId: string) => {
    const data = await readUserData();
    data.categories = data.categories.filter((c) => c.id !== categoryId);
    await writeUserData(data);
  },
  update: async (categoryId: string, changes: { name: string }) => {
    const data = await readUserData();
    data.categories = data.categories.map((category) =>
      category.id === categoryId ? { ...category, ...changes } : category
    );
    await writeUserData(data);
    return data.categories.find((category) => category.id === categoryId);
  },
};

export const unitsAPI = {
  getAll: async () => sortByName((await readUserData()).units),
  create: async (unit: { name: string; abbreviation: string }) => {
    const data = await readUserData();
    const newUnit = { id: id(), ...unit };
    data.units.push(newUnit);
    await writeUserData(data);
    return newUnit;
  },
  delete: async (unitId: string) => {
    const data = await readUserData();
    data.units = data.units.filter((u) => u.id !== unitId);
    await writeUserData(data);
  },
  update: async (unitId: string, changes: { name: string; abbreviation: string }) => {
    const data = await readUserData();
    data.units = data.units.map((unit) =>
      unit.id === unitId ? { ...unit, ...changes } : unit
    );
    await writeUserData(data);
    return data.units.find((unit) => unit.id === unitId);
  },
};

export const storesAPI = {
  getAll: async () => sortByName((await readUserData()).stores),
  create: async (store: { name: string; address?: string }) => {
    const data = await readUserData();
    const newStore = { id: id(), ...store };
    data.stores.push(newStore);
    await writeUserData(data);
    return newStore;
  },
  delete: async (storeId: string) => {
    const data = await readUserData();
    data.stores = data.stores.filter((s) => s.id !== storeId);
    await writeUserData(data);
  },
  update: async (storeId: string, changes: { name: string; address?: string }) => {
    const data = await readUserData();
    data.stores = data.stores.map((store) =>
      store.id === storeId ? { ...store, ...changes } : store
    );
    await writeUserData(data);
    return data.stores.find((store) => store.id === storeId);
  },
};

export const packagingsAPI = {
  getAll: async () => sortByName((await readUserData()).packagings),
  create: async (packaging: { name: string }) => {
    const data = await readUserData();
    const newPackaging = { id: id(), ...packaging };
    data.packagings.push(newPackaging);
    await writeUserData(data);
    return newPackaging;
  },
  delete: async (packagingId: string) => {
    const data = await readUserData();
    data.packagings = data.packagings.filter((p) => p.id !== packagingId);
    await writeUserData(data);
  },
  update: async (packagingId: string, changes: { name: string }) => {
    const data = await readUserData();
    data.packagings = data.packagings.map((packaging) =>
      packaging.id === packagingId ? { ...packaging, ...changes } : packaging
    );
    await writeUserData(data);
    return data.packagings.find((packaging) => packaging.id === packagingId);
  },
};

export const itemsAPI = {
  getAll: async () => sortByName((await readUserData()).items),
  create: async (item: {
    name: string;
    brandIds: string[];
    categoryId: string;
    unitId: string;
    packagingId: string;
    isVegan: boolean;
    packageSize: string;
  }) => {
    const data = await readUserData();
    const newItem = normalizeItem({ id: id(), ...item });
    data.items.push(newItem);
    await writeUserData(data);
    return newItem;
  },
  delete: async (itemId: string) => {
    const data = await readUserData();
    data.items = data.items.filter((i) => i.id !== itemId);
    data.pantry = data.pantry.filter((p) => p.itemId !== itemId);
    data.purchases = data.purchases.filter((p) => p.itemId !== itemId);
    await writeUserData(data);
  },
  update: async (
    itemId: string,
    changes: {
      name: string;
      brandIds: string[];
      categoryId: string;
      unitId: string;
      packagingId: string;
      isVegan: boolean;
      packageSize: string;
    }
  ) => {
    const data = await readUserData();
    data.items = data.items.map((item) =>
      item.id === itemId ? normalizeItem({ ...item, ...changes }) : item
    );
    await writeUserData(data);
    return data.items.find((item) => item.id === itemId);
  },
  getHistory: async (itemId: string) => {
    const data = await readUserData();
    return data.purchases
      .filter((purchase) => purchase.itemId === itemId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
};

export const purchasesAPI = {
  getAll: async () => (await readUserData()).purchases,
  create: async (purchase: {
    storeId: string;
    date: string;
    items: Array<{ itemId: string; brandId?: string; price: string; quantity: string }>;
  }) => {
    const data = await readUserData();

    purchase.items.forEach((item) => {
      const historyItem: PurchaseItem = {
        id: id(),
        itemId: item.itemId,
        brandId: item.brandId,
        storeId: purchase.storeId,
        date: purchase.date,
        price: Number(item.price),
        quantity: Number(item.quantity),
      };

      data.purchases.push(historyItem);

      const pantryItem = data.pantry.find((p) => p.itemId === item.itemId);
      if (pantryItem) {
        pantryItem.currentQuantity += Number(item.quantity);
        pantryItem.lastPurchasePrice = Number(item.price);
        pantryItem.lastPurchaseStore = purchase.storeId;
      } else {
        data.pantry.push({
          itemId: item.itemId,
          currentQuantity: Number(item.quantity),
          lastPurchasePrice: Number(item.price),
          lastPurchaseStore: purchase.storeId,
        });
      }
    });

    await writeUserData(data);
    return { success: true };
  },
};

export const pantryAPI = {
  getAll: async () => (await readUserData()).pantry,
  update: async (itemId: string, update: { currentQuantity: number; openedDate?: string }) => {
    const data = await readUserData();
    const existing = data.pantry.find((item) => item.itemId === itemId);

    if (existing) {
      existing.currentQuantity = update.currentQuantity;
      existing.openedDate = update.openedDate;
    } else {
      data.pantry.push({ itemId, ...update });
    }

    await writeUserData(data);
    return { itemId, ...update };
  },
};

export const seedData = async () => {
  const data = await readUserData();
  if (!data.seeded || data.items.length === 0) {
    const newData = createInitialData();
    await writeUserData(newData);
    return newData;
  }
  return data;
};
