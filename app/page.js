"use client";

import { useEffect } from "react";
import Main from "./_components/ui/Main";
import { useAuthStore } from "./_lib/authStore";
import { useHeaderStore } from "./_lib/headerStore";

function Page() {
  const headerLoaded = useHeaderStore((state) => state.headerLoaded);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  useEffect(() => {
    fetchUser();
  }, []);

  return <>{headerLoaded && <Main headerLoaded={headerLoaded} />}</>;
}

export default Page;
