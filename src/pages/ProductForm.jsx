/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

const CATEGORIES = [
  "Suplementos",
  "Chás",
  "Grãos",
  "Temperos",
  "Óleos",
  "Outros",
];

export default function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    quantity: "",
    category: "Suplementos",
  });

  useEffect(() => {
    if (product) setForm({ ...product, quantity: String(product.quantity) });
  }, [product]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave({ ...form, quantity: parseInt(form.quantity) || 0 });
  };

  const isEdit = !!product;

  return (
    <div className="animate-fade-in">
      <div className="px-4 py-2 mb-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-sm mb-4"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-4 h-4"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Voltar
        </button>
        <h2 className="text-2xl font-display font-black text-zinc-900 dark:text-white">
          {isEdit ? "Editar Produto" : "Novo Produto"}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {isEdit
            ? "Atualize as informações do produto"
            : "Preencha os dados do produto"}
        </p>
      </div>

      <div className="px-4 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            Nome do Produto *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Ex: Creatina Monohidratada"
            className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-base"
          />
        </div>

        {/* Code */}
        <div>
          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            Código
          </label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => set("code", e.target.value)}
            placeholder="Ex: CRE001"
            className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-base"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            Quantidade
          </label>
          <input
            type="number"
            value={form.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            placeholder="0"
            min="0"
            className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-base"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            Categoria
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => set("category", cat)}
                className={`py-3 px-2 rounded-2xl text-sm font-semibold transition-all active:scale-95 ${
                  form.category === cat
                    ? "bg-brand-600 text-white shadow-md"
                    : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim()}
            className="flex-2 flex-grow-[2] py-4 rounded-2xl bg-brand-600 text-white font-bold transition-all active:scale-95 disabled:opacity-40 shadow-lg shadow-brand-600/30"
          >
            {isEdit ? "Salvar Alterações" : "Cadastrar Produto"}
          </button>
        </div>
      </div>
    </div>
  );
}
