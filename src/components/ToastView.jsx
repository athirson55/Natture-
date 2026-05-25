const icons = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

const colors = {
  success: "bg-brand-600 text-white",
  error: "bg-red-600 text-white",
  warning: "bg-amber-500 text-white",
  info: "bg-blue-600 text-white",
};

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl animate-slide-up text-sm font-semibold max-w-sm w-full ${colors[t.type]}`}
        >
          <span className="text-base">{icons[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
