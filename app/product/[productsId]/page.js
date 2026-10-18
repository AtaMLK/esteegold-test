import Link from "../../_components/ui/localized-link";
import { localizedProduct } from "../../_lib/localization";
import { notFound } from "next/navigation";
import ProductDetail from "./product-detail";
import { readProduct, readPublicProducts, regionalize } from "../../_lib/commerce/page-catalog";
import { pageMetadata, productDescription, productImage, productPath, productSchema, breadcrumbSchema } from "../../_lib/seo";
import StructuredData from "../../_components/ui/structured-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, locale = "en" }) {
  const { productsId } = await params;
  const original = await readProduct(productsId);
  const product = original ? localizedProduct(original, locale) : null;
  if (!product) return pageMetadata({ title: "Piece not found — EsteeHouse", path: "/categories", noindex: true });
  return pageMetadata({ title: `${product.name} — ${product.category || "Handmade Piece"} | EsteeHouse`, description: productDescription(product), path: productPath(product), image: productImage(product) });
}

export default async function ProductPage({ params, locale = "en" }) {
  const { productsId } = await params;
  const product = await readProduct(productsId);
  if (!product) notFound();
  const candidates = (await readPublicProducts(product.branch)).filter((item) => String(item.id) !== String(product.id));
  const related = [...candidates.filter((item) => item.category === product.category), ...candidates.filter((item) => item.category !== product.category)].slice(0, 4);
  const [regionalProduct, ...regionalRelated] = await regionalize([product, ...related]);
  const collectionPath = product.branch === "EsteeBags" ? "/bags" : product.branch === "EsteeGold" ? "/silver" : "/categories";
  return <><StructuredData data={[productSchema(product, locale), breadcrumbSchema([{ name: "EsteeHouse", path: "/" }, { name: product.branch, path: collectionPath }, { name: product.name, path: productPath(product) }])]} /><ProductDetail key={product.id} initialProduct={regionalProduct} related={regionalRelated}/><nav className="product-breadcrumbs" aria-label="Breadcrumb"><Link href="/">EsteeHouse</Link><span aria-hidden="true">/</span><Link href={collectionPath}>{product.branch}</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span></nav></>;
}
