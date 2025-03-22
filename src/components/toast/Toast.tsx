import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose && onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBackground = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'info':
      default:
        return 'bg-blue-50';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-200';
      case 'error':
        return 'border-red-200';
      case 'info':
      default:
        return 'border-blue-200';
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed right-4 top-4 z-50 flex items-center rounded-md border px-4 py-3 shadow-md ${getBackground()} ${getBorderColor()}`}
      role="alert"
    >
      <div className="mr-3 flex-shrink-0">{getIcon()}</div>
      <div className="mr-4 text-sm font-medium">{message}</div>
      <button
        onClick={handleClose}
        className="-mx-1.5 -my-1.5 ml-auto rounded-lg p-1.5 hover:bg-gray-100 focus:outline-none"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
};

export interface ToastContainerProps {
  children: React.ReactNode;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ children }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) return null;

  return createPortal(
    <div className="fixed right-0 top-0 z-50 flex flex-col space-y-2 p-4">{children}</div>,
    document.body
  );
};
