import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function requireAdmin(request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return false;
  const client = adminClient();
  const { data: { user }, error } = await client.auth.getUser(token);
  if (error || !user?.email) return false;
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(user.email.toLowerCase());
}

export async function POST(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const form = await request.formData();
    const productId = String(form.get("productId") || "").trim();
    const files = form.getAll("files").filter((file) => file instanceof File);
    if (!productId) return NextResponse.json({ error: "Product id is required." }, { status: 400 });
    if (!files.length) return NextResponse.json({ error: "Choose at least one file." }, { status: 400 });
    if (files.length > 12) return NextResponse.json({ error: "Upload up to 12 files at once." }, { status: 400 });

    const client = adminClient();
    const { data: product, error: productError } = await client.from("commerce_products").select("id,name").eq("id", productId).maybeSingle();
    if (productError) throw productError;
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const { data: existing } = await client.from("commerce_product_media").select("sort_order").eq("product_id", productId).order("sort_order", { ascending: false }).limit(1);
    let sortOrder = Number(existing?.[0]?.sort_order || 0) + 1;
    const rows = [];

    for (const file of files) {
      const kind = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : null;
      if (!kind) throw new Error(`Unsupported file type: ${file.name}`);
      const maxBytes = kind === "video" ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
      if (file.size > maxBytes) throw new Error(`${file.name} is too large. Maximum is ${kind === "video" ? "100 MB" : "15 MB"}.`);
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      const path = `${productId}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { error: uploadError } = await client.storage.from("product-media").upload(path, bytes, { contentType: file.type || undefined, upsert: false, cacheControl: "31536000" });
      if (uploadError) throw uploadError;
      const { data: publicUrl } = client.storage.from("product-media").getPublicUrl(path);
      rows.push({ product_id: productId, kind, url: publicUrl.publicUrl, storage_path: path, alt_text: product.name, sort_order: sortOrder++, is_primary: false });
    }

    const { data, error } = await client.from("commerce_product_media").insert(rows).select();
    if (error) throw error;
    return NextResponse.json({ media: data || [] }, { status: 201 });
  } catch (error) {
    console.error("[admin/catalog/media POST]", error);
    return NextResponse.json({ error: error.message || "Could not upload media." }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "Media id is required." }, { status: 400 });
    const client = adminClient();
    const { data: media, error: mediaError } = await client.from("commerce_product_media").select("id,storage_path").eq("id", body.id).maybeSingle();
    if (mediaError) throw mediaError;
    if (!media) return NextResponse.json({ error: "Media not found." }, { status: 404 });
    if (media.storage_path) await client.storage.from("product-media").remove([media.storage_path]);
    const { error } = await client.from("commerce_product_media").delete().eq("id", body.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/catalog/media DELETE]", error);
    return NextResponse.json({ error: error.message || "Could not delete media." }, { status: 400 });
  }
}
