import { useState, useEffect, useCallback } from "react";
import {
  getAllProducts,
  saveProduct,
  deleteProduct,
  seedDefaultProducts,
} from "../storage/db";
import { startRealtimeSync } from "../services/realtimeSync";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState({
    enabled: false,
    online: navigator.onLine,
    state: "idle",
    error: null,
    lastSyncedAt: null,
  });

  const refresh = useCallback(async () => {
    const data = await getAllProducts();
    const visible = data
      .filter((product) => !product.deletedAt)
      .map((product) => ({
        ...product,
        updatedAt: product.updatedAt ?? 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    setProducts(visible);
  }, []);

  useEffect(() => {
    let stopSync = () => {};
    const init = async () => {
      await seedDefaultProducts();
      await refresh();
      stopSync = startRealtimeSync({
        onStatusChange: setSyncStatus,
        onRemoteChange: refresh,
      });
      setLoading(false);
    };
    init().catch(() => setLoading(false));
    return () => stopSync();
  }, [refresh]);

  const addProduct = useCallback(
    async (product) => {
      const newProduct = {
        ...product,
        id: crypto.randomUUID(),
        updatedAt: Date.now(),
        deletedAt: null,
      };
      await saveProduct(newProduct);
      await refresh();
      return newProduct;
    },
    [refresh],
  );

  const updateProduct = useCallback(
    async (product) => {
      await saveProduct({
        ...product,
        updatedAt: Date.now(),
        deletedAt: product.deletedAt ?? null,
      });
      await refresh();
    },
    [refresh],
  );

  const removeProduct = useCallback(
    async (id) => {
      await deleteProduct(id);
      await refresh();
    },
    [refresh],
  );

  const adjustQuantity = useCallback(
    async (id, delta) => {
      const product = products.find((p) => p.id === id);
      if (!product) return;
      const updated = {
        ...product,
        quantity: Math.max(0, product.quantity + delta),
        updatedAt: Date.now(),
      };
      await saveProduct(updated);
      await refresh();
    },
    [products, refresh],
  );

  const outOfStock = products.filter((p) => p.quantity <= 0);
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= 3);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    removeProduct,
    adjustQuantity,
    outOfStock,
    lowStock,
    refresh,
    syncStatus,
  };
}
