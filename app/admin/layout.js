// app/admin/layout.js
"use client";
import SideBar from "../_components/ui/SideBar";
import ToastContainer from "../_components/ui/ToastContainer";
import TopBar from "../_components/ui/TopBar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex w-full min-h-screen">
      <SideBar />
      <div className="flex-1">
        <TopBar />
        <main className="p-20 ">
          <ToastContainer />
          {children}
        </main>
      </div>
    </div>
  );
}
