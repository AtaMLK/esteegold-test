import Image from "next/image";
import Link from "./localized-link";
import { categoryLabel } from "../../_lib/localization";
import { readPublicProducts } from "../../_lib/commerce/page-catalog";
import { productPath, productImage } from "../../_lib/seo";

export default async function CollectionOverview({ collection, locale = "en" }) {
  const branch = collection === "bags" ? "EsteeBags" : collection === "silver" ? "EsteeGold" : null;
  let products = [];
  try { products = await readPublicProducts(branch); } catch { console.error("Collection overview could not load current products."); }
  const englishTitle = collection === "bags" ? "Handmade bags, with character." : collection === "silver" ? "Handmade silver, considered closely." : "Handmade bags & silver, from Türkiye.";
  const title = locale === "tr" ? collection === "bags" ? "Karakter sahibi, el yapımı çantalar." : collection === "silver" ? "Özenle tasarlanmış el yapımı gümüş." : "Türkiye’den el yapımı çantalar ve gümüş." : englishTitle;
  return <section className="collection-overview" aria-labelledby="collection-overview-title"><div className="collection-overview-intro"><p className="house-eyebrow">{locale === "tr" ? "EsteeHouse / Parçaları keşfet" : "EsteeHouse / Explore the pieces"}</p><h2 id="collection-overview-title">{title}</h2><p>{locale === "tr" ? "EsteeBags, el yapımı çanta koleksiyonumuz. EsteeGold ise her ürünün malzeme ve ölçü seçenekleriyle sunulduğu el yapımı gümüş koleksiyonumuz. Güncel parçaları ve her birinin ayrıntılarını keşfedin." : "EsteeBags is our handmade bag collection. EsteeGold is our handmade silver collection, with material and size choices shown on each product. Discover the current pieces and their individual details."}</p><Link href="/categories" className="house-text-link">{locale === "tr" ? "Koleksiyonu gör ↗" : "View the collection ↗"}</Link></div>{products.length > 0 && <ul className="collection-overview-products">{products.slice(0, 8).map((product) => <li key={product.id}><Link href={productPath(product)}><div className="collection-overview-image"><Image src={productImage(product)} alt={product.name} fill quality={95} sizes="(max-width: 700px) 42vw, 24vw"/></div><p>{categoryLabel(product.category, locale)}</p><h3>{product.name}</h3></Link></li>)}</ul>}</section>;
}
