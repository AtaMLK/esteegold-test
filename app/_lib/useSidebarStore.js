// "use client"
import { create } from "zustand";

// Sidebar global store using Zustand
export const useSidebarStore = create((set) => ({
  // Sidebar open/close state
  sideBarIsOpen: true,

  // Toggle function to switch sidebar state
  toggleSidebar: () =>
    set((state) => ({
      sideBarIsOpen: !state.sideBarIsOpen,
    })),
}));
