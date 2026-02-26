'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import Toast from './Toast';
import type { ToastAnimation, ToastType } from './Toast';
import styles from './Toast.module.css';

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
  animation?: ToastAnimation;
}

export interface ToastItem extends Required<ToastOptions> {
  id: string;
  message: string;
}

export interface ToastApi {
  add: (message: string, typeOrOptions?: ToastType | ToastOptions, durationProp?: number) => string;
  remove: (id: string) => void;
  info: (message: string, options?: number | ToastOptions) => string;
  success: (message: string, options?: number | ToastOptions) => string;
  warning: (message: string, options?: number | ToastOptions) => string;
  error: (message: string, options?: number | ToastOptions) => string;
}

const ToastContext = createContext<ToastApi | null>(null);

export const useToast = (): ToastApi => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export interface ToastProviderProps {
  children?: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (message: string, typeOrOptions: ToastType | ToastOptions = 'info', durationProp = 3000) => {
      const id = Math.random().toString(36).slice(2, 11);

      let type: ToastType = 'info';
      let duration = 3000;
      let animation: ToastAnimation = 'step';

      if (typeof typeOrOptions === 'object') {
        type = typeOrOptions.type || 'info';
        duration = typeOrOptions.duration ?? 3000;
        animation = typeOrOptions.animation || 'step';
      } else {
        type = typeOrOptions;
        duration = durationProp;
      }

      setToasts((prev) => [...prev, { id, message, type, duration, animation }]);
      return id;
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toOptions = (type: ToastType, options?: number | ToastOptions): ToastOptions => {
    if (typeof options === 'number') {
      return { type, duration: options };
    }
    return { type, ...(options || {}) };
  };

  const toast: ToastApi = {
    add: addToast,
    remove: removeToast,
    info: (msg, options) => addToast(msg, toOptions('info', options)),
    success: (msg, options) => addToast(msg, toOptions('success', options)),
    warning: (msg, options) => addToast(msg, toOptions('warning', options)),
    error: (msg, options) => addToast(msg, toOptions('error', options)),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className={styles.container}>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
