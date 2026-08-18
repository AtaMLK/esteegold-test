import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_PROJECT_URL is missing");
}

if (!supabaseKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_API_KEY is missing");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
