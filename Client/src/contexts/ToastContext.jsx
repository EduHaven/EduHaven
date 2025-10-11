import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext();

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    iconBg: "#22c55e",
  },
  error: {
    icon: XCircle,
    iconBg: "#ef4444",
  },
  warning: {
    icon: AlertCircle,
    iconBg: "#f59e0b",
  },
  info: {
    icon: Info,
    iconBg: "#3b82f6",
  },
};

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  const toastConfig = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
  const IconComponent = toastConfig.icon;

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 350);
  };

  return (
    <div
      className={`
        toast-notification
        ${isVisible && !isExiting ? "toast-visible" : "toast-hidden"}
        ${isExiting ? "toast-exiting" : ""}
      `}
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex-shrink-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: toastConfig.iconBg }}
          >
            <IconComponent className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-[15px] leading-relaxed txt">
            {toast.message}
          </div>
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 hover:scale-105"
          style={{ color: "#9ca3af" }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const ToastContainer = ({ toasts, onRemove, position = "top-right" }) => {
  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-6 left-6";
      case "top-center":
        return "top-6 left-1/2 transform -translate-x-1/2";
      case "top-right":
        return "top-6 right-6";
      case "bottom-left":
        return "bottom-6 left-6";
      case "bottom-center":
        return "bottom-6 left-1/2 transform -translate-x-1/2";
      case "bottom-right":
        return "bottom-6 right-6";
      default:
        return "top-6 right-6";
    }
  };

  return (
    <div
      className={`fixed z-50 ${getPositionClasses()} max-w-sm w-full pointer-events-none`}
    >
      <div className="space-y-3 pointer-events-auto">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              animationDelay: `${index * 150}ms`,
            }}
          >
            <Toast toast={toast} onRemove={onRemove} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, options = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = {
      id,
      message,
      type: options.type || "info",
      title: options.title,
      duration: options.duration !== undefined ? options.duration : 5000,
      ...options,
    };

    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const toast = {
    success: (message, options) =>
      addToast(message, { ...options, type: "success" }),
    error: (message, options) =>
      addToast(message, { ...options, type: "error" }),
    warning: (message, options) =>
      addToast(message, { ...options, type: "warning" }),
    info: (message, options) => addToast(message, { ...options, type: "info" }),
    remove: removeToast,
    clear: () => setToasts([]),
  };

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
        position="top-right"
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastProvider;
