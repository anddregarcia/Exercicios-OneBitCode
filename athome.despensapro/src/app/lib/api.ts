import { projectId, publicAnonKey } from "/utils/supabase/info";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-17516063`;

// Create Supabase client for getting auth token
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Get auth headers with current user's token.  If there is no
// active session the function returns headers *without* an
// Authorization field.  Sending the anon key to a protected route is
// what produced the "Invalid JWT" 401 error in the log.
async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  // supabase returns a "session" object even when nobody is signed in;
  // in that case `session.user` will be null and `access_token` is just
  // the anon key.  Passing the anon key to our protected endpoints leads
  // to an "Invalid JWT" error, so in that case we drop the header.
  if (!session || !session.user || !session.access_token) {
    return { "Content-Type": "application/json" };
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

// Generic API call helper
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    console.log(`[API] Calling ${endpoint}...`);
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] HTTP Error ${response.status} on ${endpoint}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    const data = await response.json();
    console.log(`[API] Response from ${endpoint}:`, data);

    if (!data.success) {
      throw new Error(data.error || "API request failed");
    }

    return data.data as T;
  } catch (error) {
    console.error(`[API] Error on ${endpoint}:`, error);
    throw error;
  }
}

// Brands
export const brandsAPI = {
  getAll: () => apiCall<any[]>("/brands"),
  create: (brand: { name: string; isVegan: boolean }) =>
    apiCall<any>("/brands", {
      method: "POST",
      body: JSON.stringify(brand),
    }),
  delete: (id: string) =>
    apiCall<void>(`/brands/${id}`, { method: "DELETE" }),
};

// Categories
export const categoriesAPI = {
  getAll: () => apiCall<any[]>("/categories"),
  create: (category: { name: string }) =>
    apiCall<any>("/categories", {
      method: "POST",
      body: JSON.stringify(category),
    }),
  delete: (id: string) =>
    apiCall<void>(`/categories/${id}`, { method: "DELETE" }),
};

// Units
export const unitsAPI = {
  getAll: () => apiCall<any[]>("/units"),
  create: (unit: { name: string; abbreviation: string }) =>
    apiCall<any>("/units", {
      method: "POST",
      body: JSON.stringify(unit),
    }),
  delete: (id: string) =>
    apiCall<void>(`/units/${id}`, { method: "DELETE" }),
};

// Stores
export const storesAPI = {
  getAll: () => apiCall<any[]>("/stores"),
  create: (store: { name: string; address?: string }) =>
    apiCall<any>("/stores", {
      method: "POST",
      body: JSON.stringify(store),
    }),
  delete: (id: string) =>
    apiCall<void>(`/stores/${id}`, { method: "DELETE" }),
};

// Items
export const itemsAPI = {
  getAll: () => apiCall<any[]>("/items"),
  create: (item: {
    name: string;
    brandId: string;
    categoryId: string;
    unitId: string;
    isVegan: boolean;
  }) =>
    apiCall<any>("/items", {
      method: "POST",
      body: JSON.stringify(item),
    }),
  delete: (id: string) =>
    apiCall<void>(`/items/${id}`, { method: "DELETE" }),
  getHistory: (itemId: string) =>
    apiCall<any[]>(`/items/${itemId}/history`),
};

// Purchases
export const purchasesAPI = {
  getAll: () => apiCall<any[]>("/purchases"),
  create: (purchase: {
    storeId: string;
    date: string;
    items: Array<{ itemId: string; price: string; quantity: string }>;
  }) =>
    apiCall<any>("/purchases", {
      method: "POST",
      body: JSON.stringify(purchase),
    }),
};

// Pantry
export const pantryAPI = {
  getAll: () => apiCall<any[]>("/pantry"),
  update: (itemId: string, data: { currentQuantity: number; openedDate?: string }) =>
    apiCall<any>(`/pantry/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Seed data
export const seedData = () =>
  apiCall<any>("/seed", { method: "POST" });