import { create } from "zustand";

let idCounter = 0;

export const useToastStore = create((set) => ({
  toasts: [],
  showToast: (message, type = "info", duration = 3000) => {
    const id = idCounter++;
    const newToast = { id, message, type };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, duration);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
