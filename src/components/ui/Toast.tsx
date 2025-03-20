import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, X, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose?: () => void;
  isVisible?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  duration = 3000,
  onClose,
  isVisible = true,
}) => {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (visible && duration !== Infinity) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const getToastIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'info':
        return <Info className="h-5 w-5 text-primary" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  const getToastClasses = () => {
    const baseClasses =
      'fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg p-4 shadow-lg animate-slideInUp';

    switch (type) {
      case 'success':
        return `${baseClasses} bg-emerald-50 text-emerald-800 border border-emerald-200`;
      case 'error':
        return `${baseClasses} bg-red-50 text-red-800 border border-red-200`;
      case 'info':
        return `${baseClasses} bg-blue-50 text-blue-800 border border-blue-200`;
      case 'warning':
        return `${baseClasses} bg-amber-50 text-amber-800 border border-amber-200`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className={getToastClasses()}>
      <div className="flex-shrink-0">{getToastIcon()}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
