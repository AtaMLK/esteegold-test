// app/_lib/headerStore.js
import { create } from "zustand";

export const useHeaderStore = create((set) => ({
  headerLoaded: false,
  setHeaderLoaded: (value) => set({ headerLoaded: value }),
}));
