import Main from "../_components/ui/main";

export const metadata = {
  title: "Handmade Bags — EsteeBags | EsteeHouse",
  description: "Discover the EsteeBags collection: handmade bags, expressive textures and a story in every knot. Explore the shapes and find your next companion.",
  alternates: { canonical: "/bags" },
};

export default function BagsPage() {
  return <Main collection="bags" />;
}
