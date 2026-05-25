import { useState, useCallback, useEffect } from "react";

let toastHandler = null;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000,
    );
  }, []);

  useEffect(() => {
    toastHandler = show;
    return () => {
      if (toastHandler === show) toastHandler = null;
    };
  }, [show]);

  return { toasts, show };
}

export function toast(message, type = "success") {
  if (toastHandler) toastHandler(message, type);
}
