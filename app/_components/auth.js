import { Button } from "@/components/ui/button";
import { listenAuthState, logout, signInWithGoogle } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Auth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen to auth state change and set user
    const unSubscribe = listenAuthState(setUser);

    // Cleanup the subscription when component unmounts
    console.log(user)
    return () => unSubscribe();
  }, []);

  return (
    <div>
      <div className="login-container absolute top-0 left-0 z-10 flex items-center justify-center h-screen w-screen">
        <div className="login-overlay z-20  w-[90%] md:w-[50%] h-[30%] bg-lightgreen-400 rounded-md shadow-md shadow-gray-100 flex items-center justify-center">
          {user ? (
            <>
              <div className="flex flex-col items-center justify-center gap-20">
                {" "}
                <p>Welcome, {user.displayName}</p>
                <Button
                  variant="outline"
                  className="bg-green-500 text-green-800"
                  onClick={logout}
                >
                  Log Out
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant="outline"
              className="bg-green-600 text-green-900"
              onClick={signInWithGoogle}
            >
              Sign In With Google
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
