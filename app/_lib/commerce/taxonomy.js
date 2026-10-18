import { createPublicServerClient } from "../server-supabase";

export async function getTaxonomy(client = createPublicServerClient()) {
  const [branches, categories] = await Promise.all([
    client.from("commerce_branches").select("name,product_kind").is("deleted_at", null).order("name"),
    client.from("commerce_categories").select("branch,name").is("deleted_at", null).order("name"),
  ]);
  if (branches.error) throw branches.error;
  if (categories.error) throw categories.error;
  return { branches: branches.data || [], categories: categories.data || [] };
}

export async function validateTaxonomy(client, branch, category) {
  const { data, error } = await client.from("commerce_branches").select("name,product_kind").eq("name", branch).is("deleted_at", null).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Choose an available branch.");
  const selected = await client.from("commerce_categories").select("name").eq("branch", branch).eq("name", category).is("deleted_at", null).maybeSingle();
  if (selected.error) throw selected.error;
  if (!selected.data) throw new Error("Choose a category belonging to this branch.");
  return data.product_kind;
}
