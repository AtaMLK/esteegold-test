"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "../context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Dashboard() {
  const { user, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await logout(); // Firebase'den çıkış yap
      router.push("/"); // Ana sayfaya yönlendir
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="dashbord-container px-20 mt-8 grid  grid-cols-12 gap-14">
      <div className="title-menu  col-start-1 col-span-3 border-[1px]  reounded-md p-6">
        <div className="title">
          <div className="py-6">
            <h1>Welcome {user?.displayName || "user"}!</h1>
            <p>Logo</p>
          </div>

          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <div className="menu">
          <div className="py-6">
            <h1>shopping cart!</h1>
            <p>cart</p>
          </div>
          <div className="py-6">
            <h1>shopping history!</h1>
            <p>history</p>
          </div>
          <div className="py-6 mb-5">
            <h1>profile setting</h1>
            <p>update profile</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      <div className="title-content col-start-4 col-span-9 ">
        <div className="w-full h-full border-[1px] border-gray-300  px-10 py-16 ">
          Lorem amsldk jalksdjla jaldj akkdjalskdjla sdalskdjal ksjdasdjalsj
          dlaskdjl askjdla skjdla
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
