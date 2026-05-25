import CategoryBadge from "../components/CategoryBadge";

const CATEGORIES = [
  "Suplementos",
  "Chás",
  "Grãos",
  "Temperos",
  "Óleos",
  "Outros",
];

function StatCard({ label, value, sub, color, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-0 rounded-3xl p-5 flex flex-col gap-1 text-left transition-all active:scale-95 shadow-sm ${color}`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-3xl font-display font-black leading-none">
        {value}
      </span>
      <span className="text-xs font-semibold opacity-80 leading-tight">
        {label}
      </span>
      {sub && <span className="text-[10px] opacity-60">{sub}</span>}
    </button>
  );
}

export default function Dashboard({
  products,
  outOfStock,
  lowStock,
  onNavigate,
}) {
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = products.filter((p) => p.category === cat).length;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryCounts).sort(
    (a, b) => b[1] - a[1],
  )[0];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="px-4 pt-2">
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">
          Bem-vindo ao
        </p>
        <h1 className="text-3xl font-display font-black text-zinc-900 dark:text-white">
          Natture{" "}
          <span className="text-brand-600 dark:text-brand-400">Estoque</span>
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Seu estoque de produtos naturais
        </p>
      </div>

      {/* Stats */}
      <div className="px-4">
        <div className="flex gap-3 mb-3">
          <StatCard
            label="Total de produtos"
            value={products.length}
            sub="cadastrados"
            color="bg-brand-600 text-white"
            icon="🌿"
            onClick={() => onNavigate("products")}
          />
          <StatCard
            label="Zerados"
            value={outOfStock.length}
            sub="sem estoque"
            color={
              outOfStock.length > 0
                ? "bg-red-500 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
            }
            icon="🔴"
            onClick={() => onNavigate("replenishment")}
          />
        </div>
        <div className="flex gap-3">
          <StatCard
            label="Estoque baixo"
            value={lowStock.length}
            sub="≤ 3 unidades"
            color={
              lowStock.length > 0
                ? "bg-amber-400 text-amber-900"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
            }
            icon="⚠️"
            onClick={() => onNavigate("products")}
          />
          <StatCard
            label="Categoria principal"
            value={topCategory ? topCategory[1] : 0}
            sub={topCategory ? topCategory[0] : "-"}
            color="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
            icon="📦"
          />
        </div>
      </div>

      {/* Alerts */}
      {(outOfStock.length > 0 || lowStock.length > 0) && (
        <div className="px-4 space-y-3">
          {outOfStock.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚨</span>
                  <span className="font-bold text-red-700 dark:text-red-400 text-sm">
                    Zerados ({outOfStock.length})
                  </span>
                </div>
                <button
                  onClick={() => onNavigate("replenishment")}
                  className="text-xs text-red-600 dark:text-red-400 font-semibold underline"
                >
                  Ver lista
                </button>
              </div>
              <div className="space-y-1.5">
                {outOfStock.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                    <span className="text-sm text-red-700 dark:text-red-300 truncate">
                      {p.name}
                    </span>
                  </div>
                ))}
                {outOfStock.length > 3 && (
                  <span className="text-xs text-red-500 dark:text-red-400">
                    +{outOfStock.length - 3} outros...
                  </span>
                )}
              </div>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚠️</span>
                <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">
                  Estoque baixo ({lowStock.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {lowStock.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                      <span className="text-sm text-amber-700 dark:text-amber-300 truncate">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {p.quantity} un
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-4">
        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
          Atalhos rápidos
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Novo produto",
              icon: "➕",
              page: "add",
              desc: "Cadastrar item",
            },
            {
              label: "Ver produtos",
              icon: "📋",
              page: "products",
              desc: "Listar todos",
            },
            {
              label: "Reposição",
              icon: "🛒",
              page: "replenishment",
              desc: `${outOfStock.length} em falta`,
            },
            {
              label: "Ajustar estoque",
              icon: "⚡",
              page: "products",
              desc: "Aumentar ou diminuir",
            },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.page)}
              className="bg-white dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl p-4 text-left transition-all active:scale-95 shadow-sm hover:shadow-md"
            >
              <span className="text-2xl block mb-2">{action.icon}</span>
              <span className="block text-sm font-bold text-zinc-800 dark:text-white">
                {action.label}
              </span>
              <span className="block text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                {action.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Categories overview */}
      <div className="px-4 pb-2">
        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
          Categorias
        </p>
        <div className="bg-white dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl p-4 space-y-3">
          {Object.entries(categoryCounts)
            .filter(([, count]) => count > 0)
            .map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <CategoryBadge category={cat} />
                <div className="flex items-center gap-3 flex-1 ml-3">
                  <div className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-full h-1.5">
                    <div
                      className="bg-brand-500 rounded-full h-1.5 transition-all duration-500"
                      style={{
                        width: `${products.length ? (count / products.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 w-6 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          {Object.values(categoryCounts).every((c) => c === 0) && (
            <p className="text-sm text-zinc-400 text-center py-2">
              Nenhum produto cadastrado
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
