import React, { useEffect, useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Toast = ({ message, type, id, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onRemove(id);
    }, 300); // Wait for exit animation
  };

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-destructive" />,
    info: <CheckCircle2 className="h-5 w-5 text-blue-500" />
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border bg-background p-4 shadow-lg transition-all duration-300 ease-out",
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-2 opacity-0 scale-95"
      )}
    >
      <div className="flex-shrink-0">{icons[type] || icons.info}</div>
      <div className="flex-1 text-sm font-medium text-foreground">{message}</div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse items-end gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col justify-end pointer-events-none pb-8 pr-8">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};
