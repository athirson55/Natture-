export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Confirmar', danger = false }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onCancel}>
      <div
        className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-6 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-display font-bold text-zinc-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-sm transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95 ${danger ? 'bg-red-500' : 'bg-brand-600'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
