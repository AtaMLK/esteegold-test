import { notFound } from "next/navigation";
import Main from "../../_components/ui/main";
import CategoriesPage from "../../categories/page";
import ProductPage from "../../product/[productsId]/page";
import ContactPage from "../../contact/page";
import CartPage from "../../cart/page";
import CheckoutPage from "../../checkout/page";
import CheckoutResultPage from "../../checkout/result/page";
import WishlistPage from "../../wishlist/page";
import ProfilePage from "../../profile/page";
import LoginPage from "../../auth/login/page";
import ForgotPasswordPage from "../../auth/forgot-password/page";
import ResetPasswordPage from "../../auth/reset-password/page";
import ShippingPage from "../../shipping/page";
import ReturnsPage from "../../returns/page";
import TermsPage from "../../terms/page";
import PrivacyPage from "../../privacy/page";
import { turkishPolicies } from "../../_lib/policies-tr";
import Link from "../../_components/ui/localized-link";
import { readProduct } from "../../_lib/commerce/page-catalog";
import { localizedProduct, categoryLabel } from "../../_lib/localization";
import { pageMetadata, productDescription, productImage } from "../../_lib/seo";
import "../../_components/ui/policy-page.css";

export const dynamic = "force-dynamic";

const pages = {
  "": ["EsteeHouse — Türkiye’den El Yapımı Çantalar ve Gümüş", "EsteeBags el yapımı çantaları ve EsteeGold gümüş parçalarını keşfedin. Koleksiyonlara, malzemelere, ölçülere ve ürün ayrıntılarına göz atın."],
  bags: ["EsteeBags — El Yapımı Çantalar | EsteeHouse", "Dokusu, rengi ve karakteriyle el yapımı EsteeBags çantalarını keşfedin. Güncel parçaları ve her birinin ayrıntılarını inceleyin."],
  silver: ["EsteeGold — El Yapımı Gümüş | EsteeHouse", "EsteeGold el yapımı gümüş koleksiyonunu keşfedin. Yüzükler, bileklikler ve küpeler için sunulan malzeme ve ölçü seçeneklerini inceleyin."],
  categories: ["El Yapımı Çanta ve Gümüş Koleksiyonu | EsteeHouse", "EsteeHouse koleksiyonundaki el yapımı çanta ve gümüş parçalarını inceleyin. Kategorilere göre arayın; malzemeleri, ölçüleri ve ürün ayrıntılarını karşılaştırın."],
  about: ["Atölye — EsteeHouse Hakkında", "EsteeHouse, el yapımı çantaları ve gümüş tasarımları aynı çatı altında bir araya getiriyor. Malzemelere ve ayrıntılara bakışımızı keşfedin."],
  contact: ["İletişim — EsteeHouse", "Ürünler, ölçüler veya siparişler hakkında EsteeHouse’a yazın. İstanbul, Türkiye’den el yapımı çanta ve gümüş tasarımlar."],
  "size-guide": ["Gümüş Ölçü ve Malzeme Rehberi | EsteeHouse", "AB yüzük ölçülerini, bileklik ve kolye uzunluklarını, tek beden küpeleri ve 925 gümüş ile 14 ayar altın kaplama arasındaki farkı öğrenin."],
};

export async function generateMetadata({ params, searchParams }) {
  const { path = [] } = await params;
  const key = path.join("/");
  if (turkishPolicies[`/${key}`]) {
    const policy = turkishPolicies[`/${key}`];
    return pageMetadata({ title: `${policy.title} — EsteeHouse`, description: policy.introduction, path: `/${key}`, locale: "tr", noindex: true });
  }
  if (["cart", "checkout", "checkout/result", "wishlist", "profile", "auth/login", "auth/forgot-password", "auth/reset-password"].includes(key)) return pageMetadata({ title: "Hesabınız ve alışverişiniz — EsteeHouse", description: "EsteeHouse hesabınızı ve alışverişinizi yönetin.", path: `/${key}`, locale: "tr", noindex: true });
  if (path.length === 2 && path[0] === "product") {
    const original = await readProduct(path[1]);
    if (!original) return pageMetadata({ title: "Parça bulunamadı — EsteeHouse", path: `/product/${path[1]}`, locale: "tr", noindex: true });
    const product = localizedProduct(original, "tr");
    return pageMetadata({ title: `${product.name} — ${categoryLabel(product.category, "tr")} | EsteeHouse`, description: productDescription(product), image: productImage(product), path: `/product/${path[1]}`, locale: "tr" });
  }
  if (!pages[key]) return { title: "Sayfa bulunamadı — EsteeHouse", robots: { index: false, follow: true } };
  const [title, description] = pages[key];
  const filters = await searchParams;
  return pageMetadata({ title, description, path: key ? `/${key}` : "/", locale: "tr", noindex: key === "categories" && Object.keys(filters || {}).length > 0 });
}

function About() {
  return <main className="policy-page"><header className="policy-heading"><p className="policy-eyebrow">EsteeHouse / Atölye</p><h1>Farklı malzemeler.<br/><em>Aynı sezgi.</em></h1><p className="policy-introduction">EsteeHouse, el yapımı çantaları ve gümüş parçaları aynı çatı altında buluşturuyor. Her ikisinde de formun, dokunun ve küçük ayrıntıların peşinden gidiyoruz.</p></header><div className="policy-sections guide-sections"><section><h2>İki koleksiyon, ortak bir bakış.</h2><p>EsteeBags’te düğümler, dokular ve renkler; EsteeGold’da gümüşün formu ve ışıkla ilişkisi öne çıkıyor. El yapımı olmanın getirdiği küçük farklılıklar her parçanın karakterine katkıda bulunur.</p><Link href="/bags">EsteeBags’i keşfet ↗</Link><br/><Link href="/silver">EsteeGold’u keşfet ↗</Link></section><section><h2>Seçiminizi bilerek yapın.</h2><p>Malzeme ve ölçü seçenekleri her ürünün kendi sayfasında yer alır. Bir ayrıntıdan emin değilseniz sipariş vermeden önce bize yazın.</p><Link href="/contact">Atölyeyle iletişime geçin ↗</Link></section></div></main>;
}

function SizeGuide() {
  return <main className="policy-page"><header className="policy-heading"><p className="policy-eyebrow">EsteeHouse / Yakından bakın</p><h1>Ölçü ve malzeme rehberi</h1><p className="policy-introduction">Ölçü etiketleri birer ölçüm bilgisidir; herkese aynı uyumu garanti etmez. Her parçanın sunulan seçeneklerini kendi ürün sayfasında kontrol edin.</p></header><div className="policy-sections guide-sections"><section><h2>Yüzük ölçülerimiz nasıl okunur?</h2><p>AB iç çevre sistemini kullanıyoruz: EU 52, yüzüğün iç çevresinin yaklaşık 52 mm olduğu anlamına gelir. Bu, ABD yüzük ölçüsü değildir. Mevcut ön tanımlı aralık 2 mm adımlarla EU 48–62’dir; ürüne göre sunulan seçenekler değişebilir.</p><p>En güvenilir ölçümü bir kuyumcu yapabilir. Mevcut bir yüzüğün iç çapını ölçüyorsanız yaklaşık iç çevreyi bulmak için 3,14 ile çarpabilirsiniz. Yüzüğün genişliği ve formu da uyumu etkiler. Emin değilseniz başka bir ülkenin ölçü tablosundan tahmin yürütmek yerine bize danışın.</p><Link href="/categories?branch=silver&category=Rings">Yüzükleri keşfet ↗</Link></section><section><h2>Bileklik ve kolye uzunlukları</h2><p>Bileklik ölçüleri santimetre cinsinden bitmiş uzunluğu belirtir. Ön tanımlı aralık 16–22 cm’dir. Bu değer bilek çevrenizle aynı değildir; rahatlık payı tasarıma, kapamaya ve kullanım tercihinize bağlıdır. Bileğinizi esnek bir mezurayla sıkmadan ölçün ve ürünün açıklamasını kontrol edin.</p><p>Kolye seçenekleri, sunulduğu ürünlerde 40, 45, 50, 55, 60 ve 75 cm bitmiş uzunlukları içerir. Kolye ucu, zincir yapısı ve boyun ölçünüz duruşunu etkiler. Düşündüğünüz uzunluğu yumuşak bir iple deneyebilir, kullandığınız bir kolyeyle karşılaştırabilirsiniz. Uzatma zinciri dahil olduğunu varsaymayın.</p></section><section><h2>Tek beden ne anlama gelir?</h2><p>Küpelerde “One size” (tek beden) seçeneği kullanılır. Gerçek boyutları ürün açıklamasından kontrol edin; tek beden, tüm tasarımların aynı boyutta olduğu anlamına gelmez. Birden fazla parça içeren setler için birden fazla ölçü gerekebilir. Seçenekler doğrulanmamışsa siparişten önce bize yazın.</p></section><section><h2>925 gümüş ve 14 ayar altın kaplama</h2><p>EsteeGold, el yapımı gümüş koleksiyonumuzun adıdır; tüm parçaların masif altın olduğu anlamına gelmez. Ürün için tanımlandığında 925 Silver (925 gümüş) ve 14K Gold Plated (14 ayar altın kaplama) seçenekleri sunulur.</p><p>925 gümüş, %92,5 gümüş içeren alaşımı tanımlar. Altın kaplama, yüzeyde altın katmanı bulunmasıdır; masif 14 ayar altın değildir. Kaplama kalınlığı, altındaki metal ve dayanıklılık yalnızca renkten anlaşılamaz. Satın almanız için önemli olan ayrıntıları önceden sorun.</p><p>Kaplama seçeneğinin fiyatı her üründe ayrı belirlenir. Fiyatı doğrulanmamış bir seçenek ödeme için sunulmaz.</p><Link href="/contact">Ölçü ve malzeme hakkında bize yazın ↗</Link></section></div></main>;
}

export default async function TurkishPage({ params, searchParams }) {
  const { path = [] } = await params;
  const key = path.join("/");
  if (["", "bags", "silver"].includes(key)) return <Main collection={key || "house"} locale="tr"/>;
  if (key === "categories") return <CategoriesPage searchParams={searchParams} locale="tr"/>;
  if (key === "contact") return <ContactPage/>;
  if (key === "about") return <About/>;
  if (key === "size-guide") return <SizeGuide/>;
  if (key === "cart") return <CartPage/>;
  if (key === "checkout") return <CheckoutPage/>;
  if (key === "checkout/result") return <CheckoutResultPage/>;
  if (key === "wishlist") return <WishlistPage/>;
  if (key === "profile") return <ProfilePage/>;
  if (key === "auth/login") return <LoginPage/>;
  if (key === "auth/forgot-password") return <ForgotPasswordPage/>;
  if (key === "auth/reset-password") return <ResetPasswordPage/>;
  if (key === "shipping") return <ShippingPage/>;
  if (key === "returns") return <ReturnsPage/>;
  if (key === "terms") return <TermsPage/>;
  if (key === "privacy") return <PrivacyPage/>;
  if (path.length === 2 && path[0] === "product") return <ProductPage params={Promise.resolve({ productsId: path[1] })} locale="tr"/>;
  notFound();
}
