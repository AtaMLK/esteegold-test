"use client";

import Main from "./_components/ui/Main";
import { supabase } from "./_lib/supabase";
const testFetch = async () => {
  const { data, error } = await supabase.from("products").select("*");
  console.log("products:", data);
  if (error) console.log("error:", error.message);
};
testFetch();

function page() {
  return <Main />;
}

export default page;
