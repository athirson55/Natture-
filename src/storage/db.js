const DB_NAME = "NaturaStockDB";
const DB_VERSION = 1;
const STORE_PRODUCTS = "products";

import { DEFAULT_PRODUCTS } from "./catalog";

let db = null;

export async function openDB() {
  if (db) return db;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains(STORE_PRODUCTS)) {
        const store = database.createObjectStore(STORE_PRODUCTS, {
          keyPath: "id",
        });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("category", "category", { unique: false });
        store.createIndex("quantity", "quantity", { unique: false });
      }
    };
    request.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function getAllProducts() {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_PRODUCTS, "readonly");
    const store = tx.objectStore(STORE_PRODUCTS);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function saveProduct(product) {
  const database = await openDB();
  const payload = {
    ...product,
    updatedAt: product.updatedAt ?? Date.now(),
    deletedAt: product.deletedAt ?? null,
  };
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_PRODUCTS, "readwrite");
    const store = tx.objectStore(STORE_PRODUCTS);
    const request = store.put(payload);
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function deleteProduct(id) {
  const existing = await getAllProducts();
  const product = existing.find((item) => item.id === id);
  if (!product) return;
  return saveProduct({
    ...product,
    deletedAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function seedDefaultProducts() {
  const existing = await getAllProducts();
  const normalizeText = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");

  const keyFor = (product) => {
    const code = normalizeText(product.code);
    const normalizedName = normalizeText(product.name);
    if (code) return `code:${code}|name:${normalizedName}`;
    return `name:${normalizedName}`;
  };

  const uniqueExistingKeys = new Set();
  const duplicateIds = [];
  const existingByKey = new Map();

  for (const product of existing) {
    const key = keyFor(product);
    if (uniqueExistingKeys.has(key)) {
      duplicateIds.push(product.id);
      continue;
    }
    uniqueExistingKeys.add(key);
    existingByKey.set(key, product);
  }

  for (const id of duplicateIds) {
    await deleteProduct(id);
  }

  for (const product of DEFAULT_PRODUCTS) {
    const key = keyFor(product);
    if (uniqueExistingKeys.has(key)) {
      const current = existingByKey.get(key);
      if (
        current &&
        (current.name !== product.name ||
          current.category !== product.category ||
          current.code !== product.code)
      ) {
        await saveProduct({
          ...current,
          name: product.name,
          category: product.category,
          code: product.code,
        });
      }
      continue;
    }

    await saveProduct({
      ...product,
      id: crypto.randomUUID(),
      updatedAt: Date.now(),
      deletedAt: null,
    });
    uniqueExistingKeys.add(key);
    existingByKey.set(key, product);
  }
}

// Migra os dados deste banco para outro nome de banco (útil para renomear DB em produção)
export async function migrateDatabase(targetDbName) {
  const products = await getAllProducts();

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(targetDbName, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains(STORE_PRODUCTS)) {
        const store = database.createObjectStore(STORE_PRODUCTS, {
          keyPath: "id",
        });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("category", "category", { unique: false });
        store.createIndex("quantity", "quantity", { unique: false });
      }
    };
    req.onsuccess = async (e) => {
      const targetDb = e.target.result;
      try {
        const tx = targetDb.transaction(STORE_PRODUCTS, "readwrite");
        const store = tx.objectStore(STORE_PRODUCTS);
        for (const p of products) {
          store.put(p);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = (err) => reject(err);
      } catch (err) {
        reject(err);
      }
    };
    req.onerror = (err) => reject(err.target?.error || err);
  });
}
