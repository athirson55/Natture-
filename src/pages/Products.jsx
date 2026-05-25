import { useState } from 'react'
import CategoryBadge from '../components/CategoryBadge'
import ConfirmDialog from '../components/ConfirmDialog'

function QuantityControl({ value, onIncrease, onDecrease }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onDecrease}
        disabled={value <= 0}
        className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 text-lg leading-none"
      >
        −
      </button>
      <span className={`w-10 text-center text-sm font-black ${value === 0 ? 'text-red-500' : value <= 3 ? 'text-amber-500' : 'text-zinc-800 dark:text-white'}`}>
        {value}
      </span>
      <button
        onClick={onIncrease}
        className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center transition-all active:scale-90 text-lg leading-none"
      >
        +
      </button>
    </div>
  )
}

export default function Products({ products, onAdd, onEdit, onDelete, onAdjust }) {
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [filter, setFilter] = useState('all')

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'low' && p.quantity > 0 && p.quantity <= 3) ||
      (filter === 'out' && p.quantity <= 0)
    return matchSearch && matchFilter
  })

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'low', label: 'Baixo' },
    { id: 'out', label: 'Zerados' },
  ]

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="px-4 py-2 mb-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-2xl font-display font-black text-zinc-900 dark:text-white">Produtos</h2>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 bg-brand-600 text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-lg shadow-brand-600/30 transition-all active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo
          </button>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar produtos..."
            className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-10 pr-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mb-4 flex gap-2">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === f.id
                ? 'bg-brand-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 space-y-2 pb-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl block mb-3">🌿</span>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
              {search ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </p>
            {!search && (
              <button onClick={onAdd} className="mt-4 text-brand-600 dark:text-brand-400 font-semibold text-sm">
                Cadastrar primeiro produto →
              </button>
            )}
          </div>
        ) : (
          filtered.map(product => (
            <div
              key={product.id}
              className="bg-white dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl p-4 animate-scale-in shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm leading-tight truncate max-w-[180px]">{product.name}</h3>
                    {product.quantity === 0 && <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full font-bold flex-shrink-0">ZERADO</span>}
                    {product.quantity > 0 && product.quantity <= 3 && <span className="text-[10px] bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold flex-shrink-0">BAIXO</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={product.category} />
                    {product.code && <span className="text-xs text-zinc-400 dark:text-zinc-500">#{product.code}</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(product)}
                      className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center transition-all active:scale-90"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center transition-all active:scale-90"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-red-500">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Quantidade em estoque</span>
                <QuantityControl
                  value={product.quantity}
                  onDecrease={() => onAdjust(product.id, -1)}
                  onIncrease={() => onAdjust(product.id, 1)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir produto?"
        message={`"${deleteTarget?.name}" será removido permanentemente do estoque.`}
        confirmLabel="Excluir"
        danger
        onConfirm={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
