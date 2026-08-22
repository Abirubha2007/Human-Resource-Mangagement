import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-red-650 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
            info: <Info className="w-5 h-5 text-charcoal-800 shrink-0" />
          };

          const bgColors = {
            success: 'bg-white border-green-200 text-green-800 shadow-lg',
            error: 'bg-white border-red-200 text-red-800 shadow-lg',
            warning: 'bg-white border-amber-200 text-amber-800 shadow-lg',
            info: 'bg-white border-charcoal-200 text-charcoal-800 shadow-lg'
          };

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 border rounded-xl pointer-events-auto select-none animate-fade-in ${bgColors[toast.type]}`}
              style={{ animationDuration: '0.2s' }}
            >
              {icons[toast.type]}
              <div className="flex-1 text-xs font-semibold leading-relaxed font-sans mt-0.5">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-charcoal-400 hover:text-charcoal-700 transition-colors p-0.5 rounded-lg hover:bg-charcoal-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
