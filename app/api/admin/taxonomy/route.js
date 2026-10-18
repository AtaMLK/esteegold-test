import { NextResponse } from "next/server";
import { createServiceClient, requireAdmin } from "../../../_lib/server-supabase";
import { getTaxonomy } from "../../../_lib/commerce/taxonomy";

export async function GET(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
    return NextResponse.json(await getTaxonomy(createServiceClient()), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function POST(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
    const body = await request.json();
    const name = String(body.name || "").trim();
    const kind = body.kind;
    const branch = String(body.branch || "").trim();
    if (!["branch", "category"].includes(kind) || !name || name.length > (kind === "branch" ? 60 : 80)) throw new Error("Enter a valid branch or category name.");
    const client = createServiceClient();
    const table = kind === "branch" ? "commerce_branches" : "commerce_categories";
    let existing = client.from(table).select("name,deleted_at").ilike("name", name.replace(/[\\%_]/g, "\\$&"));
    if (kind === "category") existing = existing.eq("branch", branch);
    const found = await existing.maybeSingle();
    if (found.error) throw found.error;
    if (found.data && !found.data.deleted_at) return NextResponse.json({ error: "That name already exists." }, { status: 409 });
    if (!found.data && (name.toLowerCase() === "all" || (kind === "branch" && ["house", "bags", "silver", "gold"].includes(name.toLowerCase())))) throw new Error("That name is reserved for storefront navigation. Please choose a different name.");
    if (kind === "category") {
      const parent = await client.from("commerce_branches").select("name").eq("name", branch).is("deleted_at", null).maybeSingle();
      if (parent.error) throw parent.error;
      if (!parent.data) throw new Error("Choose an available branch first.");
    }
    if (kind === "branch" && !["bag", "silver", "other"].includes(body.product_kind)) throw new Error("Choose a branch product type.");
    const values = kind === "branch" ? { name, product_kind: body.product_kind, deleted_at: null } : { name, branch, deleted_at: null };
    let mutation;
    if (found.data) {
      let restore = client.from(table).update({ deleted_at: null }).eq("name", found.data.name);
      if (kind === "category") restore = restore.eq("branch", branch);
      mutation = await restore;
    } else mutation = await client.from(table).insert(values);
    if (mutation.error) throw mutation.error;
    return NextResponse.json(await getTaxonomy(client), { status: 201 });
  } catch (error) { return NextResponse.json({ error: error.message || "Could not add this entry." }, { status: 400 }); }
}

export async function DELETE(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
    const body = await request.json();
    if (!["branch", "category"].includes(body.kind)) throw new Error("Choose a branch or category.");
    const client = createServiceClient();
    const { error } = await client.rpc("archive_catalog_taxonomy", { item_kind: body.kind, branch_name: body.branch, category_name: body.kind === "category" ? body.name : null });
    if (error) return NextResponse.json({ error: error.message }, { status: 409 });
    return NextResponse.json(await getTaxonomy(client));
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}
