import { useEffect, useRef, useState } from "react";
import { useProducts } from "./hooks/useProducts";
import { useDarkMode } from "./hooks/useDarkMode";
import { ToastContainer } from "./components/Toast";
import { useToast, toast } from "./components/toastService";
import BottomNav from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Replenishment from "./pages/Replenishment";
import Settings from "./pages/Settings";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [editProduct, setEditProduct] = useState(null);
  const [dark, setDark] = useDarkMode();
  const lastSyncErrorRef = useRef(null);
  const { toasts } = useToast();
  const {
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
  } = useProducts();

  useEffect(() => {
    if (syncStatus.state === "error" && syncStatus.error) {
      if (lastSyncErrorRef.current !== syncStatus.error) {
        toast(`Falha na sincronização: ${syncStatus.error}`, "error");
        lastSyncErrorRef.current = syncStatus.error;
      }
    } else {
      lastSyncErrorRef.current = null;
    }
  }, [syncStatus]);

  const handleNavigate = (target) => {
    setEditProduct(null);
    setPage(target);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setPage("add");
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setPage("add");
  };

  const handleSave = async (form) => {
    if (editProduct) {
      await updateProduct({ ...editProduct, ...form });
      toast("Produto atualizado com sucesso!", "success");
    } else {
      await addProduct(form);
      toast("Produto cadastrado com sucesso!", "success");
    }
    setEditProduct(null);
    setPage("products");
  };

  const handleDelete = async (id) => {
    await removeProduct(id);
    toast("Produto removido com sucesso.", "warning");
  };

  const handleAdjust = async (id, delta) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const newQty = Math.max(0, product.quantity + delta);
    await adjustQuantity(id, delta);
    if (newQty === 0) toast(product.name + " zerou!", "warning");
    else
      toast(
        product.name + ": " + newQty + " un",
        delta > 0 ? "success" : "info",
      );
  };

  const handleReplenish = async (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    await adjustQuantity(id, 1);
    toast(`${product.name} reposto para 1 unidade.`, "success");
  };

  const handleReplenishAll = async () => {
    if (outOfStock.length === 0) {
      toast("Nenhum produto para repor!", "info");
      return;
    }

    for (const product of outOfStock) {
      await adjustQuantity(product.id, 1);
    }
    toast(
      `${outOfStock.length} produto(s) reposto(s) para 1 unidade.`,
      "success",
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl animate-bounce-sm">
            🌿
          </div>
          <p className="font-display font-black text-xl text-zinc-900 dark:text-white">
            Natture Estoque
          </p>
          <p className="text-sm text-zinc-400 mt-1">Carregando...</p>
        </div>
      </div>
    );
  }

  const activeTab = [
    "dashboard",
    "products",
    "replenishment",
    "settings",
  ].includes(page)
    ? page
    : "products";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <div className="fixed top-3 right-3 z-50">
        <div
          className={`px-3 py-2 rounded-full text-xs font-bold shadow-lg border backdrop-blur-md ${
            !syncStatus.enabled
              ? "bg-zinc-600 text-white border-zinc-500/40"
              : syncStatus.state === "synced"
                ? "bg-emerald-500 text-white border-emerald-400/40"
                : syncStatus.state === "syncing"
                  ? "bg-blue-500 text-white border-blue-400/40"
                  : syncStatus.state === "offline"
                    ? "bg-zinc-700 text-white border-zinc-600/40"
                    : syncStatus.state === "error"
                      ? "bg-red-500 text-white border-red-400/40"
                      : "bg-zinc-600 text-white border-zinc-500/40"
          }`}
        >
          {!syncStatus.enabled
            ? "Sync desativado"
            : syncStatus.online
              ? "Online"
              : "Offline"}
          {syncStatus.enabled &&
            syncStatus.state === "syncing" &&
            " · Sincronizando"}
          {syncStatus.enabled &&
            syncStatus.state === "synced" &&
            " · Sincronizado"}
          {syncStatus.enabled && syncStatus.state === "error" && " · Erro"}
        </div>
      </div>
      <ToastContainer toasts={toasts} />
      <main className="pb-24 pt-6 max-w-lg mx-auto">
        {page === "dashboard" && (
          <Dashboard
            products={products}
            outOfStock={outOfStock}
            lowStock={lowStock}
            onNavigate={handleNavigate}
          />
        )}
        {page === "products" && (
          <Products
            products={products}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdjust={handleAdjust}
          />
        )}
        {page === "add" && (
          <ProductForm
            product={editProduct}
            onSave={handleSave}
            onCancel={() => setPage("products")}
          />
        )}
        {page === "replenishment" && (
          <Replenishment
            outOfStock={outOfStock}
            onReplenish={handleReplenish}
            onReplenishAll={handleReplenishAll}
          />
        )}
        {page === "settings" && (
          <Settings
            dark={dark}
            setDark={setDark}
            products={products}
            onRefresh={refresh}
          />
        )}
      </main>
      <BottomNav
        active={activeTab}
        onChange={handleNavigate}
        badge={outOfStock.length}
      />
    </div>
  );
}
