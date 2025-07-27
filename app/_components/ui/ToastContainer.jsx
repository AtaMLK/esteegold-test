"use client";

import { useToastStore } from "@/hooks/useToastStore";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Info, AlertTriangle, X } from "lucide-react";

const icons = {
  success: <CheckCircle className="text-green-500" size={20} />,
  error: <AlertTriangle className="text-red-500" size={20} />,
  info: <Info className="text-blue-500" size={20} />,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-5 right-5 flex flex-col gap-3 z-[9999]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.25 }}
            className={`min-w-[250px] max-w-sm px-4 py-3 rounded-lg shadow-md flex items-center justify-between gap-3 bg-white border-l-4 ${
              toast.type === "success"
                ? "border-green-500"
                : toast.type === "error"
                ? "border-red-500"
                : "border-blue-500"
            }`}
          >
            <div className="flex items-center gap-2">
              {icons[toast.type]}
              <p className="text-sm text-stone-700">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-500 hover:text-black transition"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
