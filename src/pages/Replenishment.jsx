import { toast } from "../components/toastService";

export default function Replenishment({
  outOfStock,
  onReplenish,
  onReplenishAll,
}) {
  const copyList = async () => {
    if (outOfStock.length === 0) {
      toast("Nenhum produto para repor!", "info");
      return;
    }
    const text = `LISTA DE REPOSIÇÃO 🌿\n\n${outOfStock.map((p) => `• ${p.name}`).join("\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      toast("Lista copiada para área de transferência!", "success");
    } catch {
      toast("Não foi possível copiar. Selecione manualmente.", "error");
    }
  };

  const copyFull = async () => {
    if (outOfStock.length === 0) {
      toast("Tudo ok no estoque!", "success");
      return;
    }

    const lines = [
      "LISTA DE REPOSIÇÃO 🌿",
      "",
      "🔴 ZERADOS:",
      ...outOfStock.map((p) => `• ${p.name}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast("Lista completa copiada!", "success");
    } catch {
      toast("Não foi possível copiar.", "error");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="px-4 py-2 mb-6">
        <h2 className="text-2xl font-display font-black text-zinc-900 dark:text-white">
          Reposição
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Produtos que precisam ser repostos
        </p>
      </div>

      {/* Summary cards */}
      <div className="px-4 flex gap-3 mb-6">
        <div className="flex-1 bg-red-500 rounded-3xl p-4 text-white">
          <span className="text-3xl font-display font-black">
            {outOfStock.length}
          </span>
          <p className="text-xs font-semibold opacity-80 mt-0.5">Zerados</p>
        </div>
      </div>

      <div className="px-4 mb-6">
        <button
          type="button"
          onClick={onReplenishAll}
          disabled={outOfStock.length === 0}
          className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all active:scale-95 disabled:opacity-40 disabled:shadow-none"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-5 h-5"
          >
            <path d="M4 12h16" />
            <path d="M12 4v16" />
          </svg>
          Repor todos
        </button>
        <p className="text-xs text-center text-zinc-400 dark:text-zinc-500 mt-2">
          Marca todos os itens zerados como repostos para 1 unidade.
        </p>
      </div>

      {/* Out of stock */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🔴</span>
            <h3 className="font-display font-black text-zinc-900 dark:text-white">
              Produtos em Falta
            </h3>
          </div>
          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full font-bold">
            {outOfStock.length}
          </span>
        </div>

        {outOfStock.length === 0 ? (
          <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50 rounded-2xl p-6 text-center">
            <span className="text-3xl block mb-2">✅</span>
            <p className="text-brand-700 dark:text-brand-400 font-bold">
              Nenhum produto zerado!
            </p>
            <p className="text-sm text-brand-600 dark:text-brand-500 mt-1">
              Seu estoque está completo.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {outOfStock.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onReplenish?.(p.id)}
                className="bg-white dark:bg-zinc-800/60 border border-red-100 dark:border-red-900/30 rounded-2xl px-4 py-3.5 flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
                title="Clique para marcar como reposto"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 dark:text-white text-sm truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {p.category}
                    {p.code ? ` · #${p.code}` : ""}
                  </p>
                </div>
                <span className="text-xs font-black text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">
                  0 un
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Copy buttons */}
      <div className="px-4 space-y-3 pb-2">
        <button
          onClick={copyList}
          className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-5 h-5"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          COPIAR LISTA (Zerados)
        </button>
        <button
          onClick={copyFull}
          className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-5 h-5"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copiar Lista Completa
        </button>
        <p className="text-xs text-center text-zinc-400 dark:text-zinc-500">
          A lista inclui apenas produtos com 0 unidades.
        </p>
      </div>
    </div>
  );
}
