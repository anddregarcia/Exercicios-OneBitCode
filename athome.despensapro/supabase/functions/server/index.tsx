import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Prefix for all routes
const prefix = "/make-server-17516063";

// Health check
app.get(`${prefix}/health`, (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============ BRANDS ============
app.get(`${prefix}/brands`, async (c) => {
  try {
    const brands = await kv.getByPrefix("brand:");
    return c.json({ success: true, data: brands });
  } catch (error) {
    console.log("Error fetching brands:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post(`${prefix}/brands`, async (c) => {
  try {
    const body = await c.req.json();
    const { name, isVegan } = body;
    
    if (!name) {
      return c.json({ success: false, error: "Name is required" }, 400);
    }
    
    const id = crypto.randomUUID();
    const brand = { id, name, isVegan: isVegan || false };
    
    await kv.set(`brand:${id}`, brand);
    return c.json({ success: true, data: brand });
  } catch (error) {
    console.log("Error creating brand:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete(`${prefix}/brands/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`brand:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting brand:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ CATEGORIES ============
app.get(`${prefix}/categories`, async (c) => {
  try {
    const categories = await kv.getByPrefix("category:");
    return c.json({ success: true, data: categories });
  } catch (error) {
    console.log("Error fetching categories:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post(`${prefix}/categories`, async (c) => {
  try {
    const body = await c.req.json();
    const { name } = body;
    
    if (!name) {
      return c.json({ success: false, error: "Name is required" }, 400);
    }
    
    const id = crypto.randomUUID();
    const category = { id, name };
    
    await kv.set(`category:${id}`, category);
    return c.json({ success: true, data: category });
  } catch (error) {
    console.log("Error creating category:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete(`${prefix}/categories/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`category:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting category:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ UNITS ============
app.get(`${prefix}/units`, async (c) => {
  try {
    const units = await kv.getByPrefix("unit:");
    return c.json({ success: true, data: units });
  } catch (error) {
    console.log("Error fetching units:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post(`${prefix}/units`, async (c) => {
  try {
    const body = await c.req.json();
    const { name, abbreviation } = body;
    
    if (!name || !abbreviation) {
      return c.json({ success: false, error: "Name and abbreviation are required" }, 400);
    }
    
    const id = crypto.randomUUID();
    const unit = { id, name, abbreviation };
    
    await kv.set(`unit:${id}`, unit);
    return c.json({ success: true, data: unit });
  } catch (error) {
    console.log("Error creating unit:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete(`${prefix}/units/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`unit:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting unit:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ STORES ============
app.get(`${prefix}/stores`, async (c) => {
  try {
    const stores = await kv.getByPrefix("store:");
    return c.json({ success: true, data: stores });
  } catch (error) {
    console.log("Error fetching stores:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post(`${prefix}/stores`, async (c) => {
  try {
    const body = await c.req.json();
    const { name, address } = body;
    
    if (!name) {
      return c.json({ success: false, error: "Name is required" }, 400);
    }
    
    const id = crypto.randomUUID();
    const store = { id, name, address: address || "" };
    
    await kv.set(`store:${id}`, store);
    return c.json({ success: true, data: store });
  } catch (error) {
    console.log("Error creating store:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete(`${prefix}/stores/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`store:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting store:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ ITEMS ============
app.get(`${prefix}/items`, async (c) => {
  try {
    const items = await kv.getByPrefix("item:");
    return c.json({ success: true, data: items });
  } catch (error) {
    console.log("Error fetching items:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post(`${prefix}/items`, async (c) => {
  try {
    const body = await c.req.json();
    const { name, brandId, categoryId, unitId, isVegan } = body;
    
    if (!name || !brandId || !categoryId || !unitId) {
      return c.json({ success: false, error: "Name, brandId, categoryId, and unitId are required" }, 400);
    }
    
    const id = crypto.randomUUID();
    const item = { id, name, brandId, categoryId, unitId, isVegan: isVegan || false };
    
    await kv.set(`item:${id}`, item);
    return c.json({ success: true, data: item });
  } catch (error) {
    console.log("Error creating item:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete(`${prefix}/items/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`item:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting item:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ PURCHASES ============
app.get(`${prefix}/purchases`, async (c) => {
  try {
    const purchases = await kv.getByPrefix("purchase:");
    return c.json({ success: true, data: purchases });
  } catch (error) {
    console.log("Error fetching purchases:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post(`${prefix}/purchases`, async (c) => {
  try {
    const body = await c.req.json();
    const { storeId, date, items } = body;
    
    if (!storeId || !date || !items || !Array.isArray(items)) {
      return c.json({ success: false, error: "StoreId, date, and items array are required" }, 400);
    }
    
    const purchaseId = crypto.randomUUID();
    const purchase = {
      id: purchaseId,
      storeId,
      date,
      createdAt: new Date().toISOString(),
    };
    
    // Save main purchase
    await kv.set(`purchase:${purchaseId}`, purchase);
    
    // Save individual purchase items
    const savedItems = [];
    for (const item of items) {
      const { itemId, price, quantity } = item;
      if (!itemId || !price || !quantity) continue;
      
      const purchaseItemId = crypto.randomUUID();
      const purchaseItem = {
        id: purchaseItemId,
        purchaseId,
        itemId,
        storeId,
        price: parseFloat(price),
        quantity: parseFloat(quantity),
        date,
      };
      
      await kv.set(`purchaseItem:${purchaseItemId}`, purchaseItem);
      savedItems.push(purchaseItem);
    }
    
    return c.json({ success: true, data: { purchase, items: savedItems } });
  } catch (error) {
    console.log("Error creating purchase:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get purchase history for a specific item
app.get(`${prefix}/items/:itemId/history`, async (c) => {
  try {
    const itemId = c.req.param("itemId");
    const allPurchaseItems = await kv.getByPrefix("purchaseItem:");
    
    const history = allPurchaseItems
      .filter((pi: any) => pi.itemId === itemId)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return c.json({ success: true, data: history });
  } catch (error) {
    console.log("Error fetching item history:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ PANTRY ============
app.get(`${prefix}/pantry`, async (c) => {
  try {
    const pantryItems = await kv.getByPrefix("pantry:");
    return c.json({ success: true, data: pantryItems });
  } catch (error) {
    console.log("Error fetching pantry:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put(`${prefix}/pantry/:itemId`, async (c) => {
  try {
    const itemId = c.req.param("itemId");
    const body = await c.req.json();
    const { currentQuantity, openedDate } = body;
    
    const pantryItem = {
      itemId,
      currentQuantity: parseFloat(currentQuantity),
      openedDate: openedDate || null,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`pantry:${itemId}`, pantryItem);
    return c.json({ success: true, data: pantryItem });
  } catch (error) {
    console.log("Error updating pantry item:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ SEED DATA ============
app.post(`${prefix}/seed`, async (c) => {
  try {
    // Seed initial data
    const brands = [
      { id: "1", name: "Taeq", isVegan: true },
      { id: "2", name: "Nestlé", isVegan: false },
      { id: "3", name: "Qualitá", isVegan: false },
      { id: "4", name: "Hellmann's", isVegan: false },
      { id: "5", name: "Açúcar União", isVegan: true },
    ];

    const categories = [
      { id: "1", name: "Grãos e Cereais" },
      { id: "2", name: "Laticínios" },
      { id: "3", name: "Condimentos" },
      { id: "4", name: "Bebidas" },
      { id: "5", name: "Limpeza" },
    ];

    const units = [
      { id: "1", name: "Quilograma", abbreviation: "kg" },
      { id: "2", name: "Litro", abbreviation: "L" },
      { id: "3", name: "Unidade", abbreviation: "un" },
      { id: "4", name: "Pacote", abbreviation: "pct" },
      { id: "5", name: "Caixa", abbreviation: "cx" },
    ];

    const stores = [
      { id: "1", name: "Pão de Açúcar", address: "Av. Paulista, 1000" },
      { id: "2", name: "Carrefour", address: "Rua Augusta, 500" },
      { id: "3", name: "Extra", address: "Shopping Center Norte" },
      { id: "4", name: "Dia", address: "Rua da Consolação, 200" },
    ];

    const items = [
      { id: "1", name: "Arroz Integral", brandId: "1", categoryId: "1", unitId: "1", isVegan: true },
      { id: "2", name: "Feijão Preto", brandId: "3", categoryId: "1", unitId: "1", isVegan: true },
      { id: "3", name: "Leite Integral", brandId: "2", categoryId: "2", unitId: "2", isVegan: false },
      { id: "4", name: "Azeite de Oliva", brandId: "3", categoryId: "3", unitId: "2", isVegan: true },
      { id: "5", name: "Maionese", brandId: "4", categoryId: "3", unitId: "4", isVegan: false },
      { id: "6", name: "Açúcar Refinado", brandId: "5", categoryId: "1", unitId: "1", isVegan: true },
    ];

    // Save to KV store
    for (const brand of brands) {
      await kv.set(`brand:${brand.id}`, brand);
    }
    for (const category of categories) {
      await kv.set(`category:${category.id}`, category);
    }
    for (const unit of units) {
      await kv.set(`unit:${unit.id}`, unit);
    }
    for (const store of stores) {
      await kv.set(`store:${store.id}`, store);
    }
    for (const item of items) {
      await kv.set(`item:${item.id}`, item);
    }

    return c.json({ success: true, message: "Data seeded successfully" });
  } catch (error) {
    console.log("Error seeding data:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
