'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Toast.module.css';

export type ToastType = 'info' | 'success' | 'warning' | 'error';
export type ToastAnimation = 'step' | 'smooth' | 'pop' | 'none';

export interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  animation?: ToastAnimation;
  onDismiss?: (id: string) => void;
}

const ICONS: Record<ToastType, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '🛑',
};

const Toast = ({
  id,
  message,
  type = 'info',
  duration = 3000,
  animation = 'step',
  onDismiss,
}: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const isDismissingRef = useRef(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDismiss = useCallback(() => {
    if (isDismissingRef.current) return;

    isDismissingRef.current = true;
    setIsExiting(true);

    const exitDuration = animation === 'none' ? 0 : 300;
    exitTimerRef.current = setTimeout(() => {
      onDismiss?.(id);
    }, exitDuration);
  }, [animation, id, onDismiss]);

  useEffect(() => {
    if (!duration) return undefined;

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleDismiss]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${styles[animation]} ${isExiting ? styles.exiting : ''}`}
      role="alert"
    >
      <span className={styles.icon}>{ICONS[type]}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeBtn} onClick={handleDismiss} aria-label="Close" type="button">
        ×
      </button>
    </div>
  );
};

export default Toast;
