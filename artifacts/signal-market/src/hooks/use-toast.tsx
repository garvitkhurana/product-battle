import * as React from "react";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

const ToastContext = React.createContext<{ toast: (props: ToastProps) => void }>({
  toast: () => undefined,
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: number })[]>([]);
  const toast = React.useCallback((props: ToastProps) => {
    const id = Date.now();
    setToasts((current) => [...current, { ...props, id }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3000);
  }, []);
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed top-20 right-0 z-[60] w-full max-w-sm space-y-2 p-4 sm:top-4">
        {toasts.map((toastItem) => (
          <div
            key={toastItem.id}
            className={`pointer-events-auto rounded-md border p-4 shadow-lg ${
              toastItem.variant === "destructive"
                ? "border-destructive bg-destructive text-destructive-foreground"
                : "border-border bg-card text-foreground"
            }`}
          >
            {toastItem.title && <div className="text-sm font-bold">{toastItem.title}</div>}
            {toastItem.description && <div className="text-sm opacity-90">{toastItem.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
}

export function Toaster() {
  return null;
}