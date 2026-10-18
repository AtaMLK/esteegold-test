import { pageMetadata } from "./_lib/seo";
import Main from "./_components/ui/main";

export const metadata = pageMetadata({ title: "EsteeHouse — Handmade Bags & Silver from Türkiye", description: "Discover handmade bags by EsteeBags and silver pieces by EsteeGold. Explore the current EsteeHouse collection, materials, sizes and individual product details.", path: "/" });
export const dynamic = "force-dynamic";

export default function HomePage() {
  return <Main />;
}
