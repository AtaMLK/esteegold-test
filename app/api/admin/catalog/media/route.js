import { NextResponse } from "next/server";
import { createServiceClient as adminClient, requireAdmin } from "../../../../_lib/server-supabase";


async function completeSignedUpload(request) {
  const body = await request.json();
  const productId = String(body.productId || "").trim();
  const files = Array.isArray(body.files) ? body.files : [];
  if (!productId || !files.length || files.length > 12) throw new Error("Product and 1–12 uploaded files are required.");
  const paths = new Set();
  for (const file of files) {
    const path = String(file.path || "");
    if (!["image", "video"].includes(file.kind) || !path.startsWith(productId + "/") || path.split("/").some((segment) => segment === ".." || segment === ".") || paths.has(path)) throw new Error("Each media file must have a unique upload path belonging to this product and a valid media type.");
    paths.add(path);
  }
  const client = adminClient();
  const { data: product, error: productError } = await client.from("commerce_products").select("id,name").eq("id", productId).maybeSingle();
  if (productError) throw productError;
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  const { data: existing } = await client.from("commerce_product_media").select("sort_order").eq("product_id", productId).order("sort_order", { ascending: false }).limit(1);
  let sortOrder = Number(existing?.[0]?.sort_order || 0) + 1;
  const rows = files.map((file, index) => ({
    product_id: productId,
    kind: file.kind === "video" ? "video" : "image",
    url: client.storage.from("product-media").getPublicUrl(String(file.path)).data.publicUrl,
    storage_path: String(file.path),
    alt_text: String(file.altText || product.name),
    sort_order: sortOrder++,
    is_primary: !(existing?.length) && index === 0,
  }));
  const { data, error } = await client.from("commerce_product_media").insert(rows).select();
  if (error) throw error;
  const primary = (data || []).find((item) => item.kind === "image");
  if (primary) await client.from("commerce_products").update({ image_url: primary.url, updated_at: new Date().toISOString() }).eq("id", productId);
  return NextResponse.json({ media: data || [] }, { status: 201 });
}

export async function POST(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) return await completeSignedUpload(request);

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
      if (!kind) throw new Error("Unsupported file type.");
      if (kind === "image" && file.type !== "image/webp") throw new Error("Convert images to WebP before uploading.");
      if (kind === "image" && file.size > 15 * 1024 * 1024) throw new Error("Image is too large. Maximum is 15 MB.");
      if (kind === "video" && file.size > 15 * 1024 * 1024) throw new Error("Video is too large. Maximum is 15 MB.");
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      const path = productId + "/" + Date.now() + "-" + crypto.randomUUID() + "-" + safeName;
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { error: uploadError } = await client.storage.from("product-media").upload(path, bytes, { contentType: file.type || undefined, upsert: false, cacheControl: "31536000" });
      if (uploadError) throw uploadError;
      const publicUrl = client.storage.from("product-media").getPublicUrl(path).data.publicUrl;
      rows.push({ product_id: productId, kind, url: publicUrl, storage_path: path, alt_text: product.name, sort_order: sortOrder++, is_primary: false });
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
    const { data: media, error: mediaError } = await client.from("commerce_product_media").select("id,product_id,storage_path,url,kind").eq("id", body.id).maybeSingle();
    if (mediaError) throw mediaError;
    if (!media) return NextResponse.json({ error: "Media not found." }, { status: 404 });
    if (media.storage_path) {
      const { error: storageError } = await client.storage.from("product-media").remove([media.storage_path]);
      if (storageError) throw storageError;
    }
    const { error } = await client.from("commerce_product_media").delete().eq("id", body.id);
    if (error) throw error;
    const { data: replacement } = await client.from("commerce_product_media").select("url").eq("product_id", media.product_id).eq("kind", "image").order("sort_order", { ascending: true }).limit(1).maybeSingle();
    if (media.kind === "image") {
      const { error: imageError } = await client.from("commerce_products").update({ image_url: replacement?.url || null, updated_at: new Date().toISOString() }).eq("id", media.product_id).eq("image_url", media.url);
      if (imageError) throw imageError;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/catalog/media DELETE]", error);
    return NextResponse.json({ error: error.message || "Could not delete media." }, { status: 400 });
  }
}
