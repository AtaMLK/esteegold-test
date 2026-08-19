import { NextResponse } from "next/server";
import { getProducts } from "../../_lib/commerce/catalog";

export async function GET(request) {
  try {
    const branch = new URL(request.url).searchParams.get("branch");
    if (branch && !["EsteeGold", "EsteeBags"].includes(branch)) return NextResponse.json({ error: "Invalid branch." }, { status: 400 });
    const products = await getProducts({ branch: branch || null });
    return NextResponse.json({ products }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch (error) {
    console.error("Catalog error", error);
    return NextResponse.json({ error: "Unable to load catalog." }, { status: 500 });
  }
}
