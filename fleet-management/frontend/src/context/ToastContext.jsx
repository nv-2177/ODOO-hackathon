import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: "border-l-[var(--color-success)] text-[var(--color-success)]",
  warning: "border-l-[var(--color-danger)] text-[var(--color-danger)]",
  info: "border-l-[var(--color-teal)] text-[var(--color-teal)]",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const dismiss = (id) => setToasts((t) => t.filter((toast) => toast.id !== id));

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <div
              key={t.id}
              className={`bg-[var(--color-surface-2)] border border-[var(--color-border)] border-l-4 ${COLORS[t.type]} rounded-md shadow-lg px-3.5 py-3 flex items-start gap-2.5 animate-[fadeIn_0.2s_ease]`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="text-sm text-[var(--color-text)] flex-1 leading-snug">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-[var(--color-text-faint)] hover:text-[var(--color-text)] shrink-0"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
