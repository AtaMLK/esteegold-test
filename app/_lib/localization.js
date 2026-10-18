export function localeFromPath(pathname = "/") {
  return pathname === "/tr" || pathname.startsWith("/tr/") ? "tr" : "en";
}

export function unlocalizedPath(pathname = "/") {
  return localeFromPath(pathname) === "tr" ? pathname.slice(3) || "/" : pathname;
}

export function hasTranslation(pathname) {
  const path = unlocalizedPath(pathname.split(/[?#]/)[0]);
  return ["/", "/bags", "/silver", "/categories", "/about", "/contact", "/size-guide", "/cart", "/checkout", "/checkout/result", "/wishlist", "/profile", "/auth/login", "/auth/forgot-password", "/auth/reset-password", "/shipping", "/returns", "/terms", "/privacy"].includes(path) || /^\/product\/[^/]+$/.test(path);
}

export function localizedHref(href, locale = "en") {
  if (typeof href !== "string" || !href.startsWith("/") || href.startsWith("//")) return href;
  const path = unlocalizedPath(href);
  return locale === "tr" && hasTranslation(path) ? `/tr${path === "/" ? "" : path}` : path;
}

export function translate(locale, english, turkish) {
  return locale === "tr" ? turkish : english;
}

const categoryNames = { Rings: "Yüzükler", Bracelets: "Bileklikler", Necklaces: "Kolyeler", Earrings: "Küpeler", Sets: "Setler", "Paracord Bags": "Paracord Çantalar" };

export function categoryLabel(name, locale) {
  return locale === "tr" ? categoryNames[name] || name : name;
}

const descriptions = {
  "1": "Günlük kullanım için zarif bir yüzük.",
  "2": "Birlikte kullanabileceğiniz katmanlı bir takı seti.",
  "3": "Karakteriyle öne çıkan bir çift küpe.",
  "4": "Elinizde farklı bir görünüm yaratan bir takı kombinasyonu.",
  "5": "Her gün kullanabileceğiniz klasik bir çift küpe.",
  "6": "Günlük kullanım için sade bir bileklik.",
  "1c66f38c-70a2-414a-8960-7d347b03fe4b": "Okyanusun mavisini ve derinliğini hatırlatan el yapımı bir çanta.",
};

export function localizedProduct(product, locale) {
  if (locale !== "tr") return product;
  return { ...product, description: product.description_tr || descriptions[product.id] || `${product.name}, EsteeHouse el yapımı koleksiyonundan. Malzeme, ölçü ve seçenekleri aşağıda inceleyebilirsiniz.`, story: product.story_tr || "Her parçanın kendine özgü bir karakteri var. Formu, dokusu ve elde yapımın küçük farklılıkları, onu kişisel kılan ayrıntılar." };
}
