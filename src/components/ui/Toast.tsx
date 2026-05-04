// Tiny toast system. A module-level subscriber list lets non-React code
// (storage errors, QR validation) push messages without prop-drilling.

import { useEffect, useState } from 'react';

interface Toast {
  id: number;
  message: string;
  tone: 'info' | 'error';
}

type Listener = (toast: Toast) => void;

const listeners = new Set<Listener>();
let nextId = 1;

export function showToast(message: string, tone: 'info' | 'error' = 'info'): void {
  const t: Toast = { id: nextId++, message, tone };
  listeners.forEach((l) => l(t));
}

export function ToastViewport() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener: Listener = (t) => {
      setToasts((cur) => [...cur, t]);
      window.setTimeout(() => {
        setToasts((cur) => cur.filter((x) => x.id !== t.id));
      }, 4000);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto max-w-md rounded-lg px-4 py-3 text-sm font-medium shadow-lg ring-1 ${
            t.tone === 'error'
              ? 'bg-red-600 text-white ring-red-400'
              : 'bg-slate-700 text-slate-50 ring-slate-500'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
