"use client";

import Main from "./_components/ui/Main";
import { UserProvider } from "./context/userContext";

function page({ ...props }) {
  return (
    <UserProvider>
      <Main {...props} />
    </UserProvider>
  );
}

export default page;
