import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

let client;

export const supabase = (() => {
  if (client) return client;
  client = createBrowserClient(supabaseUrl, supabaseKey);
  return client;
})();
