import { useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import { toast } from "../components/toastService";
import { saveProduct } from "../storage/db";

export default function Settings({ dark, setDark, products, onRefresh }) {
  const [clearConfirm, setClearConfirm] = useState(false);

  const handleExport = () => {
    const json = JSON.stringify(products, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `natture-estoque-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Backup exportado com sucesso!", "success");
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error("Formato inválido");
      for (const p of data) await saveProduct(p);
      await onRefresh();
      toast(`${data.length} produtos importados com sucesso!`, "success");
    } catch {
      toast("Erro ao importar arquivo!", "error");
    }
    e.target.value = "";
  };

  const outOfStock = products.filter((p) => p.quantity <= 0).length;
  const totalUnits = products.reduce((s, p) => s + p.quantity, 0);

  return (
    <div className="animate-fade-in">
      <div className="px-4 py-2 mb-6">
        <h2 className="text-2xl font-display font-black text-zinc-900 dark:text-white">
          Configurações
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Personalize e gerencie o aplicativo
        </p>
      </div>

      {/* Stats summary */}
      <div className="px-4 mb-6">
        <div className="bg-white dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Resumo do Estoque
          </p>
          {[
            { label: "Total de produtos", value: products.length },
            { label: "Total de unidades", value: totalUnits },
            { label: "Produtos zerados", value: outOfStock },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {item.label}
              </span>
              <span className="font-black text-zinc-900 dark:text-white">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="px-4 mb-6">
        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
          Aparência
        </p>
        <div className="bg-white dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl overflow-hidden">
          <button
            onClick={() => setDark(!dark)}
            className="w-full flex items-center justify-between px-4 py-4 transition-all active:bg-zinc-50 dark:active:bg-zinc-700/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{dark ? "🌙" : "☀️"}</span>
              <div className="text-left">
                <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                  Modo Escuro
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {dark ? "Ativado" : "Desativado"}
                </p>
              </div>
            </div>
            <div
              className={`w-12 h-6 rounded-full transition-all duration-300 relative ${dark ? "bg-brand-600" : "bg-zinc-200 dark:bg-zinc-700"}`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${dark ? "left-6" : "left-0.5"}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Backup */}
      <div className="px-4 mb-6">
        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
          Backup e restauração
        </p>
        <div className="space-y-2">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 bg-white dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl px-4 py-4 transition-all active:scale-[0.98]"
          >
            <span className="text-xl">💾</span>
            <div className="text-left">
              <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                Exportar backup
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Salvar dados como JSON
              </p>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4 text-zinc-400 ml-auto"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <label className="w-full flex items-center gap-3 bg-white dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl px-4 py-4 cursor-pointer transition-all active:scale-[0.98]">
            <span className="text-xl">📂</span>
            <div className="text-left">
              <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                Importar backup
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Restaurar dados de JSON
              </p>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4 text-zinc-400 ml-auto"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* About */}
      <div className="px-4 mb-6">
        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
          Sobre
        </p>
        <div className="bg-white dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl p-4 text-center">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
            🌿
          </div>
          <h3 className="font-display font-black text-zinc-900 dark:text-white text-lg">
            Natture Estoque
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            v1.0.0 · PWA · Offline First
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
            Controle de estoque para lojas de produtos naturais.
            <br />
            Todos os dados salvos localmente no dispositivo.
          </p>
        </div>
      </div>

      <div className="px-4 pb-2">
        <p className="text-xs text-center text-zinc-300 dark:text-zinc-600">
          💚 Dados armazenados localmente · Funciona offline
        </p>
      </div>

      <ConfirmDialog
        open={clearConfirm}
        title="Limpar todos os dados?"
        message="Todos os produtos serão removidos permanentemente. Esta ação não pode ser desfeita."
        confirmLabel="Limpar Tudo"
        danger
        onConfirm={async () => {
          setClearConfirm(false);
        }}
        onCancel={() => setClearConfirm(false)}
      />
    </div>
  );
}
