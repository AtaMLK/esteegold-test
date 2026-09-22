import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
async function requireAdmin(request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return false;
  const { data: { user }, error } = await db().auth.getUser(token);
  if (error || !user?.email) return false;
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(user.email.toLowerCase());
}
const IMAGE_MAX = 15 * 1024 * 1024;
const VIDEO_MAX = 15 * 1024 * 1024;
const ALLOWED_VIDEO = new Set(["video/mp4","video/webm","video/quicktime"]);
export async function POST(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const body = await request.json();
    const productId = String(body.productId || "").trim();
    const files = Array.isArray(body.files) ? body.files : [];
    if (!productId) return NextResponse.json({ error: "Product id is required." }, { status: 400 });
    if (!files.length || files.length > 12) return NextResponse.json({ error: "Choose between 1 and 12 files." }, { status: 400 });

    const client = db();
    const { data: product, error: productError } = await client.from("commerce_products").select("id,name").eq("id", productId).maybeSingle();
    if (productError) throw productError;
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const uploads = [];
    for (const file of files) {
      const kind = file.kind === "video" ? "video" : file.kind === "image" ? "image" : null;
      const size = Number(file.size || 0);
      const contentType = String(file.contentType || "");
      if (!kind) throw new Error("Every file must be an image or video.");
      if (kind === "image" && (!contentType.startsWith("image/") || size > IMAGE_MAX)) throw new Error("Images must be valid image files up to 15 MB.");
      if (kind === "video" && (!ALLOWED_VIDEO.has(contentType) || size > VIDEO_MAX)) throw new Error("Videos must be MP4, WebM or MOV and no larger than 15 MB.");
      const safeName = String(file.name || "media").toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      const path = productId + "/" + Date.now() + "-" + crypto.randomUUID() + "-" + safeName;
      const { data: signed, error } = await client.storage.from("product-media").createSignedUploadUrl(path, { upsert: false });
      if (error) throw error;
      uploads.push({ path, token: signed.token, kind, contentType, altText: product.name });
    }
    return NextResponse.json({ uploads, expiresIn: 7200 });
  } catch (error) {
    console.error("[admin/catalog/media/sign]", error);
    return NextResponse.json({ error: error.message || "Could not prepare media upload." }, { status: 400 });
  }
}
