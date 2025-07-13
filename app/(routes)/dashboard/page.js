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
  { title: "Orders ", icon: <ShoppingBasketIcon />, content: <Orders /> },
  { title: "Order History", icon: <History />, content: <OrderHistory /> },
  { title: "Setting", icon: <Settings2Icon />, content: <Setting /> },
];

function Dashboard() {
  const [isLoggingout, setIsLoggingout] = useState(false);
  const [selectedItem, setSelectedItem] = useState(menuItems[0]);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = async () => {
    setIsLoggingout(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {}
  };

  return (
    <div className="dashbord-container px-4 lg:px-20 mt-8 grid  grid-cols-12 gap-4 lg:gap-14">
      <div className="flex flex-col gap-8 title-menu col-start-1 col-span-3 border-[1px] reounded-md p-6">
        <div className="title">
          <div className="m-6 flex items-center gap-2">
            <UserCircle2 />
            <h1 className="text-md lg:text-md uppercase">
              Welcome {user?.user_metadata.name || " user "}!
            </h1>
          </div>
        </div>
        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`flex items-center py-4 cursor-pointer ${
                selectedItem === item
                  ? "p-6 rounded-lg bg-lightgreen-500 text-darkgreen-700"
                  : ""
              } `}
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-center gap-4">
                <span className="">{item.icon}</span>
                <h3 className="hidden  md:block">{item.title}</h3>
              </div>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="bg-darkgreen-500 text-lightgreen-300 hover:bg-lightgreen-600 hover:text-darkgreen-900 transition-all duration-100"
        >
          {isLoggingout ? "Loging Out..." : "Logout"}
        </Button>
      </div>
      <div className="title-content col-start-4 col-span-9 ">
        <div className="w-full h-full border-[1px] border-gray-300  px-10 py-16 ">
          <h2 className="text-3xl">{selectedItem.content}</h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
