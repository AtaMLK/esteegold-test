"use client";

import { useSidebarStore } from "@/app/_lib/useSidebarStore";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function TopBar() {
  const sideBarIsOpen = useSidebarStore((state) => state.sideBarIsOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  return (
    <div className="Topbar bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Toggle Icon */}
      <motion.button
        onClick={toggleSidebar}
        className="p-1 rounded hover:bg-gray-100 transition"
        animate={{ rotate: sideBarIsOpen ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </motion.button>

      {/* Panel Title */}
      <motion.h2
        className="text-xl font-bold text-gray-800"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        Admin Panel
      </motion.h2>
    </div>
  );
}
