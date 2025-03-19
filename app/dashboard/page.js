"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "../context/userContext";
import { useRouter } from "next/navigation";

function Dashboard() {
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    // Redirect to login page if user is not logged in
    router.push("/auth/login");
    return null; // Prevent rendering until the redirect happens
  }

  return (
    <div>
      <h1>welcome to your dashboar ,{user.displayName || "User"}!</h1>
      <Button variant="default" onClick={handleClick}>
        Log Out
      </Button>
    </div>
  );
}

export default Dashboard;
