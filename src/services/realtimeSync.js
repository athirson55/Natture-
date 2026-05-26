import { getAllProducts, saveProduct } from "../storage/db";
import { supabase } from "./supabaseClient";

const SYNC_INTERVAL_MS = 15000;
const SYNC_DEBOUNCE_MS = 750;

const normalizeProduct = (product) => ({
  ...product,
  quantity: Number(product.quantity ?? 0),
  updatedAt: Number(product.updatedAt ?? 0),
  deletedAt: product.deletedAt ?? null,
});

const toRemotePayload = (product) => ({
  id: product.id,
  name: product.name,
  code: product.code ?? null,
  quantity: Number(product.quantity ?? 0),
  category: product.category,
  updatedAt: Number(product.updatedAt ?? Date.now()),
  deletedAt: product.deletedAt ?? null,
});

export function startRealtimeSync({ onStatusChange, onRemoteChange } = {}) {
  if (!supabase) {
    onStatusChange?.({
      enabled: false,
      online: navigator.onLine,
      state: "disabled",
      error: null,
      lastSyncedAt: null,
    });
    return () => {};
  }

  let cancelled = false;
  let syncTimer = null;
  let intervalId = null;
  let channel = null;
  let syncing = false;

  const emitStatus = (patch) => {
    onStatusChange?.((prev) => ({
      enabled: true,
      online: navigator.onLine,
      state: "idle",
      error: null,
      lastSyncedAt: null,
      ...prev,
      ...patch,
    }));
  };

  const scheduleSync = () => {
    if (cancelled) return;
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      syncTimer = null;
      void syncNow();
    }, SYNC_DEBOUNCE_MS);
  };

  const syncNow = async () => {
    if (cancelled || syncing) return;
    if (!navigator.onLine) {
      emitStatus({ online: false, state: "offline" });
      return;
    }

    syncing = true;
    emitStatus({ online: true, state: "syncing", error: null });

    try {
      const [remoteResult, localRaw] = await Promise.all([
        supabase.from("products").select("*"),
        getAllProducts(),
      ]);

      if (remoteResult.error) throw remoteResult.error;

      const remote = (remoteResult.data ?? []).map(normalizeProduct);
      const local = localRaw.map(normalizeProduct);
      const remoteById = new Map(
        remote.map((product) => [product.id, product]),
      );

      const localToPush = local.filter((product) => {
        const remoteProduct = remoteById.get(product.id);
        return !remoteProduct || product.updatedAt > remoteProduct.updatedAt;
      });

      if (localToPush.length > 0) {
        const { error } = await supabase
          .from("products")
          .upsert(localToPush.map(toRemotePayload), { onConflict: "id" });
        if (error) throw error;
      }

      for (const remoteProduct of remote) {
        const localProduct = local.find((item) => item.id === remoteProduct.id);
        if (!localProduct || remoteProduct.updatedAt > localProduct.updatedAt) {
          await saveProduct(remoteProduct);
        }
      }

      onRemoteChange?.();
      emitStatus({
        online: true,
        state: "synced",
        lastSyncedAt: Date.now(),
        error: null,
      });
    } catch (error) {
      emitStatus({
        online: navigator.onLine,
        state: "error",
        error: error?.message || "Falha ao sincronizar",
      });
    } finally {
      syncing = false;
    }
  };

  const handleOnline = () => scheduleSync();
  const handleOffline = () => emitStatus({ online: false, state: "offline" });

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  channel = supabase
    .channel("products-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products" },
      () => scheduleSync(),
    )
    .subscribe(() => {
      emitStatus({
        online: navigator.onLine,
        state: navigator.onLine ? "syncing" : "offline",
      });
      scheduleSync();
    });

  intervalId = window.setInterval(scheduleSync, SYNC_INTERVAL_MS);
  scheduleSync();

  return () => {
    cancelled = true;
    if (syncTimer) clearTimeout(syncTimer);
    if (intervalId) window.clearInterval(intervalId);
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
    if (channel) supabase.removeChannel(channel);
  };
}
