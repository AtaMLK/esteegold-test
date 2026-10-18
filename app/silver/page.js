import { pageMetadata } from "../_lib/seo";
import Main from "../_components/ui/main";

export const metadata = pageMetadata({ title: "Handmade Silver — EsteeGold | EsteeHouse", description: "Explore EsteeGold, the handmade silver collection from EsteeHouse. Discover current rings, bracelets and earrings with clearly labelled materials and size choices.", path: "/silver" });
export const dynamic = "force-dynamic";

export default function SilverPage() {
  return <Main collection="silver" />;
}
