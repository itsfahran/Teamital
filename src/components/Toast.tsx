'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './ui';

type Kind = 'success' | 'error' | 'info';
type ToastState = { id: number; kind: Kind; message: string } | null;

type Api = {
  success: (m: string) => void;
  error: (m: string) => void;
  info: (m: string) => void;
};

const Ctx = createContext<Api>({ success() {}, error() {}, info() {} });

const COLORS: Record<Kind, [string, string]> = {
  success: ['#059669', 'check_circle'],
  error: ['#EF4444', 'error_outline'],
  info: ['#1A56DB', 'info'],
};

/** Toastify-style floating alert (port of WebToast). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((kind: Kind, message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), kind, message });
    timer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const api: Api = {
    success: (m) => show('success', m),
    error: (m) => show('error', m),
    info: (m) => show('info', m),
  };

  const [color, icon] = toast ? COLORS[toast.kind] : ['', ''];
  return (
    <Ctx.Provider value={api}>
      {children}
      {toast && (
        <div className="toast-wrap" role="status" aria-live="polite">
          <div
            key={toast.id}
            className="toast"
            style={{
              borderColor: color + '59',
              boxShadow: `0 10px 24px ${color}2E`,
            }}
          >
            <Icon name={icon} size={22} color={color} />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
