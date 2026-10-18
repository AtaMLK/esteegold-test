import { pageMetadata } from "../_lib/seo";
import Main from "../_components/ui/main";

export const metadata = pageMetadata({ title: "Handmade Bags — EsteeBags | EsteeHouse", description: "Explore EsteeBags, the handmade bag collection from EsteeHouse in Türkiye. Discover current bag designs, textures and individual product details.", path: "/bags" });
export const dynamic = "force-dynamic";

export default function BagsPage() {
  return <Main collection="bags" />;
}
