import { collections, getChapters, getGalleryPieces } from "./house-content";

const collectionCopy = {
  house: { eyebrow: "EsteeBags & EsteeGold / Aynı çatı altında", shopLabel: "İki koleksiyonu keşfet", closing: "Farklı malzemeler.", closingEmphasis: "Aynı sezgi.", note: "El yapımı çantalar ve gümüş parçalar. Ayrıntılara gösterilen aynı özenin iki farklı ifadesi." },
  bags: { eyebrow: "EsteeBags / El yapımı çantalar", shopLabel: "EsteeBags’i keşfet", closing: "Her düğümde", closingEmphasis: "bir hikâye.", note: "Gündelik hayatınıza yeni bir form. Çantaları inceleyin veya atölyenin gümüş dünyasına adım atın." },
  silver: { eyebrow: "EsteeGold / El yapımı gümüş", shopLabel: "EsteeGold’u keşfet", closing: "Yalnızca bir takı değil.", closingEmphasis: "Size ait bir ayrıntı.", note: "Bir formun, bir yansımanın, bir ayrıntının peşinden gidin. Sizi yansıtan gümüş parçayı bulun." },
};

const chapters = {
  house: [
    ["Atölye", "Karakter sahibi", "tasarımlar.", "El yapımı çantalar ve gümüş. Farklı malzemeler; kişisel bir şey yaratma isteği aynı.", "Çantaları keşfet"],
    ["EsteeGold / El yapımı gümüş", "Işıkla", "bir sohbet.", "Gözü yakalayan bir form. Aklınızda kalan bir ayrıntı. Atölyenin gümüş dünyasını keşfedin.", "Gümüşü keşfet"],
    ["Yakından bakın", "Küçük ayrıntılar.", "Kalıcı bir his.", "Bir yüzüğün kıvrımı. Bir yüzeyin ritmi. Günlük hayatınızın parçası olan tasarımlar.", "Gümüş koleksiyonuna bakın"],
    ["EsteeBags / El yapımı çantalar", "Elde yapılır.", "Sizinle şekillenir.", "Dokulu, biraz beklenmedik ve kuşkusuz el yapımı. Her düğümün bir hikâyesi var.", "Çanta koleksiyonuna bakın"],
    ["Yapım süreci", "İnsan eline", "yer açın.", "Görünen bir doku. Hissedilen bir ayrıntı. Küçük farklılıklar, tasarımın karakterine aittir.", "Atölyenin içinde"],
    ["Farklı bir ritim", "Sessiz", "bir duruş.", "İfade gücü yüksek bir formun bağırmasına gerek yok. Bazen en küçük ayrıntı en çok şeyi söyler.", "Gümüşün hikâyesi"],
    ["Her gün", "Yanınıza alın.", "Sizin olsun.", "Sevdiğiniz parçalar özel bir günü beklemez. Dünyada hareket etme biçiminizin parçası olur.", "Çantaların hikâyesi"],
    ["Sizin bakışınız", "Bazı şeyler", "sizinle kalır.", "Bir malzeme seçin. Bir hissin peşinden gidin. Atölyede kendi yolunuzu bulun.", "Atölye seçkisini keşfet"],
  ],
  bags: [
    ["EsteeBags / El yapımı çantalar", "Kendi izinizi", "takip edin.", "Dokusu, rengi ve kendine özgü karakteriyle el yapımı çantalar. Biraz beklenmedik. Tam size göre."],
    ["Doku", "Yanınızda taşıdığınız", "bir his.", "Örgüye yakından bakın. İplerin her kesişimi formun bir parçasına dönüşür."],
    ["Siluet", "Yumuşak çizgiler.", "Güçlü karakter.", "İlk izlenimi siluet yaratır. Yeniden bakmanızı sağlayan ise ayrıntılardır."],
    ["Renk", "Size özgü", "bir gündelik hayat.", "Güne yön veren bir renk. Sıradan bir anı özenli kılan bir doku."],
    ["Yapım", "El emeği", "ayrıntıda saklı.", "Düğümler, kıvrımlar ve küçük farklılıklar görünür kalır. Gizlenecek bir kusur değil, tasarımın parçasıdır.", "Atölyeyi tanıyın"],
    ["Beklenmedik olan", "Başka bir", "yola sapın.", "Tanıdık bir nesneye farklı bir bakış. Size en yakın gelen formun peşinden gidin."],
    ["Yol arkadaşı", "Kapıdan çıkın.", "Güne karışın.", "Plansız öğleden sonraları ve tanıdık yollar için. Bir çanta, sizinle yol aldıkça kişiselleşir."],
    ["Çanta seçkisi", "Yeni yol", "arkadaşınızı bulun.", "Çanta koleksiyonundaki formlara, renklere ve dokulara yakından bakın.", "Çanta seçkisini keşfet"],
  ],
  silver: [
    ["EsteeGold / El yapımı gümüş", "Biraz ışık.", "Kalıcı bir his.", "İfade gücü yüksek gümüş parçalar, özenli oranlar ve kişisel ayrıntılar. Atölyenin sakin dünyasına hoş geldiniz."],
    ["Form", "Kıvrımın", "peşinden gidin.", "Bir çizgi forma dönüşür. Bir form, tekrar tekrar elinizin gittiği bir parçaya."],
    ["Ayrıntı", "Sakin, ama asla", "sıradan değil.", "Yakından bakın. Dokudaki bir değişim, farklı bir kenar, sizinle hareket eden bir yansıma."],
    ["Birliktelik", "Kendi tarzınızla", "bir araya getirin.", "Tek başına bir parça veya birkaç parça arasında bir sohbet. Onu kendinize ait kılmanın tek bir yolu yok."],
    ["Bakış açısı", "Her yönden", "özenle düşünülmüş.", "Bir nesneyi kişisel kılan ayrıntılara çekiliyoruz. Oran. Doku. Teninizde duruşu.", "Atölyenin içinde"],
    ["Yansıma", "Bırakın ışık", "sizi bulsun.", "Hafif bir vurgu. Farklı bir ritim. Günlük hayatın hissini değiştirmenin küçük bir yolu."],
    ["Her gün", "Sıkça takın.", "Yakınınızda tutun.", "Bizimle kalan parçalar, hikâyemizin bir parçasına dönüşenlerdir."],
    ["Gümüş seçkisi", "Sizi yansıtanı", "bulun.", "Gümüş koleksiyonunu keşfedin; formları ve ayrıntıları kendi tarzınızla bir araya getirin.", "Gümüş seçkisini keşfet"],
  ],
};

export function getCollection(collection, locale) {
  return locale === "tr" ? { ...collections[collection], ...collectionCopy[collection] } : collections[collection];
}

export function localizedChapters(collection, locale) {
  const original = getChapters(collection);
  if (locale !== "tr") return original;
  return original.map((chapter, index) => {
    const [label, title, emphasis, description, link] = chapters[collection][index];
    return { ...chapter, label, title, emphasis, description, alt: `${collections[collection].name} — ${label}`, link: link || collectionCopy[collection].shopLabel };
  });
}

export function localizedGallery(collection, locale) {
  const original = getGalleryPieces(collection);
  if (locale !== "tr") return original;
  const bags = ["Gündelik örgü", "Taşınan doku", "Farklı bir ritim", "Yumuşak bir taraf", "Elde düğümlendi", "Biraz renk", "Günlük yol arkadaşı", "Sizin iziniz"];
  const silver = ["Form üzerine", "Kıvrımın peşinde", "Sessiz bir duruş", "Birlikte daha güzel"];
  return original.map((piece, index) => {
    if (piece.nameTr) return { ...piece, name: piece.nameTr, category: piece.category.startsWith("EsteeBags") ? "EsteeBags / El yapımı çantalar" : "EsteeGold / 925 ayar gümüş" };
    const isBag = piece.category.startsWith("EsteeBags");
    const position = collection === "house" ? Math.floor(index / 2) : index;
    return { ...piece, name: isBag ? bags[position] : silver[position % 4] + (position > 3 ? " / II" : ""), category: isBag ? "EsteeBags / El yapımı çantalar" : "EsteeGold / El yapımı gümüş" };
  });
}
