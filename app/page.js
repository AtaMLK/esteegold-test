"use client";

import { useState } from "react";
import Header from "./_components/ui/Header";
import Main from "./_components/ui/Main";

function Page() {
  const [headerLoaded, setHeaderLoaded] = useState(false);

  return (
    <>
      <Header onHeaderFinish={() => setHeaderLoaded(true)} />
      <Main headerLoaded={headerLoaded} />;
    </>
  );
}

export default Page;
