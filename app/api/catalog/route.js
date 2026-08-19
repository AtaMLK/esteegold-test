import { NextResponse } from "next/server";
import { getProducts } from "../../_lib/commerce/catalog";

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    const branchParam = params.get("branch");
    const idParam = params.get("ids");
    if (branchParam && !["EsteeGold", "EsteeBags"].includes(branchParam)) return NextResponse.json({ error: "Invalid branch." }, { status: 400 });
    const ids = idParam ? idParam.split(",").map((id) => id.trim()).filter(Boolean) : null;
    const products = await getProducts({ branch: branchParam || null, ids });
    return NextResponse.json({ products }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch (error) {
    console.error("Catalog error", error);
    return NextResponse.json({ error: "Unable to load catalog." }, { status: 500 });
  }
}
