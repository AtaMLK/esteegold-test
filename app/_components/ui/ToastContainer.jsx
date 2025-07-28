"use client";

import { useToastStore } from "@/hooks/useToastStore";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Info, AlertTriangle, X } from "lucide-react";

const icons = {
  success: <CheckCircle className="text-green-500" size={20} />,
  error: <AlertTriangle className="text-red-500" size={20} />,
  info: <Info className="text-blue-500" size={20} />,
};

const bgColors = {
  success: "bg-green-500/40",
  error: "bg-red-500/40",
  info: "bg-blue-500/40",
};

const borderColors = {
  success: "border-green-500",
  error: "border-red-500",
  info: "border-blue-500",
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
            className={`relative overflow-hidden min-w-[250px] max-w-sm min-h-[60px] px-4 py-3 rounded-lg shadow-md flex items-center justify-between gap-3 bg-white border-l-4 ${borderColors[toast.type]}`}
          >
            <motion.div
              className={`absolute top-0 left-0 h-full ${bgColors[toast.type]}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }} 
            />

            <div className="flex items-center gap-2 z-10">
              {icons[toast.type]}
              <p className="text-sm text-stone-700">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-500 hover:text-black transition z-10"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
