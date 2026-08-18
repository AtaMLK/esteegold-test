"use client";

import { Button } from "@/components/ui/button";
import {
  History,
  Settings2Icon,
  ShoppingBasketIcon,
  UserCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Orders from "@/app/_components/ui/Orders";
import Setting from "@/app/_components/ui/Setting";
import OrderHistory from "@/app/_components/ui/OrderHistory";
import { useAuthStore } from "@/app/_lib/authStore";

const menuItems = [
  { title: "Orders", icon: <ShoppingBasketIcon />, content: <Orders /> },
  { title: "Order History", icon: <History />, content: <OrderHistory /> },
  { title: "Setting", icon: <Settings2Icon />, content: <Setting /> },
];

function Dashboard() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedItem, setSelectedItem] = useState(menuItems[0]);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!user && loading) {
      fetchUser();
      return;
    }

    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, fetchUser, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error.message);
      setIsLoggingOut(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-black/45">Loading account…</p>
      </div>
    );
  }

  return (
    <div className="dashbord-container mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-4 pb-20 lg:grid-cols-12 lg:gap-10 lg:px-10">
      <aside className="title-menu rounded-md border border-black/10 p-5 lg:col-span-3">
        <div className="mb-8 flex items-center gap-2">
          <UserCircle2 />
          <h1 className="text-sm uppercase tracking-[0.08em]">
            Welcome {user.user_metadata?.name || "user"}
          </h1>
        </div>

        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              <button
                type="button"
                className={`flex w-full items-center rounded-lg px-4 py-3 text-left ${
                  selectedItem.title === item.title
                    ? "bg-black text-white"
                    : "hover:bg-black/5"
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm">{item.title}</span>
              </button>
            </li>
          ))}
        </ul>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="mt-8 w-full"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out…" : "Logout"}
        </Button>
      </aside>

      <section className="title-content min-h-[420px] rounded-md border border-black/10 p-6 lg:col-span-9 lg:p-10">
        {selectedItem.content}
      </section>
    </div>
  );
}

export default Dashboard;
