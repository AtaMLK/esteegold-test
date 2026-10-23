const image = (name) => `/images/stories/${name}.webp`;

// All photography depicts the owner's actual lotus ring and blue paracord bag.
const ring = image('lotus-cutout');
const worn = image('lotus-worn');
const bag = image('blue-stone');
const scene = (id, title, trTitle, subtitle, trSubtitle, image, treatment, label, trLabel) => ({ id, title, trTitle, subtitle, trSubtitle, image, treatment, label, trLabel });

export const productStories = {
  house: [
    scene('house', ['One house.', 'A world of character.'], ['Tek çatı.', 'Kendine özgü bir dünya.'], 'Silver that catches the light. Bags that carry a little of you. Welcome to EsteeHouse.', 'Işığı yakalayan gümüş. Sizden bir parça taşıyan çantalar. EsteeHouse’a hoş geldiniz.', worn, 'editorial', 'EsteeHouse / Istanbul', 'EsteeHouse / İstanbul'),
    scene('silver', ['A little silver.', 'A lot of soul.'], ['Biraz gümüş.', 'Birçok anlam.'], 'Meet the lotus. Follow one ring through the world of EsteeGold.', 'Lotus ile tanışın. Bir yüzüğün izinde EsteeGold dünyasına adım atın.', ring, 'suspended', '01 / EsteeGold', '01 / EsteeGold'),
    scene('detail', ['Look closer.', 'Stay a little.'], ['Yakından bakın.', 'Biraz kalın.'], 'Sculpted shoulders. Petals traced in light. A small object with its own point of view.', 'Heykelsi kıvrımlar. Işıkla belirginleşen yapraklar. Kendi bakış açısına sahip küçük bir nesne.', ring, 'stone', 'The lotus / A study in detail', 'Lotus / Ayrıntılara bir bakış'),
    scene('wear', ['Made personal.', 'By you.'], ['Size ait.', 'Sizinle.'], 'From an object you notice to a piece you reach for. Discover the silver story.', 'Dikkatinizi çeken bir nesneden, her gün elinizin gittiği bir parçaya. Gümüşün hikâyesini keşfedin.', worn, 'worn', 'EsteeGold / Worn your way', 'EsteeGold / Sizin tarzınızla'),
    scene('bags', ['Another material.', 'The same instinct.'], ['Farklı malzeme.', 'Aynı sezgi.'], 'Cobalt cord. Silver-grey knots. An unexpected touch of orange. Step into EsteeBags.', 'Kobalt ip. Gümüş grisi düğümler. Beklenmedik bir turuncu dokunuş. EsteeBags’e adım atın.', bag, 'bag', '02 / EsteeBags', '02 / EsteeBags'),
  ],
  silver: [
    scene('lotus', ['A lotus.', 'A little universe.'], ['Bir lotus.', 'Küçük bir evren.'], 'One ring. A journey through form, light and the way you wear it.', 'Bir yüzük. Formun, ışığın ve onu taşıma biçiminizin izinde bir yolculuk.', ring, 'suspended', 'EsteeGold / The lotus story', 'EsteeGold / Lotus’un hikâyesi'),
    scene('fall', ['Let go.', 'Follow the light.'], ['Bırakın.', 'Işığı takip edin.'], 'A moment suspended. A new way to see a familiar shape.', 'Havada asılı bir an. Tanıdık bir forma yeni bir bakış.', ring, 'fall', '01 / In motion', '01 / Hareket'),
    scene('stone', ['A soft landing.', 'A lasting impression.'], ['Yumuşak bir iniş.', 'Kalıcı bir iz.'], 'Silver meets stone. The lotus opens in the afternoon light.', 'Gümüş taşla buluşuyor. Lotus, öğleden sonra ışığında açılıyor.', ring, 'stone', '02 / Form & surface', '02 / Form ve yüzey'),
    scene('water', ['A different world.', 'The same lotus.'], ['Başka bir dünya.', 'Aynı lotus.'], 'Light breaks into ripples. Follow the reflection back to the surface.', 'Işık dalgalara ayrılıyor. Yansımayı yüzeye kadar takip edin.', ring, 'water', '03 / A reflection', '03 / Yansıma'),
    scene('return', ['Back to the light.', 'Closer to you.'], ['Yeniden ışıkta.', 'Size daha yakın.'], 'An object becomes personal through touch, movement and the moments around it.', 'Bir nesne; dokunuşla, hareketle ve etrafındaki anlarla kişiselleşir.', ring, 'return', '04 / The return', '04 / Dönüş'),
    scene('wear', ['The final detail.', 'Is you.'], ['Son ayrıntı.', 'Sizsiniz.'], 'The same lotus, worn in real life. Find your own piece in the EsteeGold collection.', 'Aynı lotus, hayatın içinde. EsteeGold koleksiyonunda kendi parçanızı bulun.', worn, 'worn', '05 / Made personal', '05 / Size ait'),
  ],
  bags: [
    scene('blue', ['Follow your', 'own thread.'], ['Kendi izinizi', 'takip edin.'], 'One blue bag. A little orange. A story in every knot.', 'Mavi bir çanta. Biraz turuncu. Her düğümde bir hikâye.', bag, 'bag', 'EsteeBags / The blue story', 'EsteeBags / Mavinin hikâyesi'),
    scene('texture', ['Come closer.', 'Feel the rhythm.'], ['Yaklaşın.', 'Ritmi hissedin.'], 'Cord crosses cord. The construction is part of the character.', 'İp iple buluşur. Yapısı, karakterinin bir parçasıdır.', image('blue-detail'), 'texture', '01 / Texture', '01 / Doku'),
    scene('colour', ['A little bold.', 'Entirely yours.'], ['Biraz cesur.', 'Tamamen sizin.'], 'Cobalt blue, silver grey and a bright orange accent. Colour with a point of view.', 'Kobalt mavi, gümüş grisi ve canlı bir turuncu vurgu. Kendine özgü renkler.', image('blue-orange'), 'colour', '02 / Colour', '02 / Renk'),
    scene('carry', ['Out of the frame.', 'Into your day.'], ['Kadrajdan çıkın.', 'Güne karışın.'], 'The same handmade bag, carried your way. See the weave in real life.', 'Aynı el yapımı çanta, sizin tarzınızla. Örgüyü hayatın içinde görün.', image('blue-carried'), 'carried', '03 / Carried', '03 / Sizinle'),
    scene('keep', ['Some things', 'stay with you.'], ['Bazı şeyler', 'sizinle kalır.'], 'Explore the EsteeBags collection. Find the texture that feels like you.', 'EsteeBags koleksiyonunu keşfedin. Sizi yansıtan dokuyu bulun.', bag, 'bag-finale', '04 / Your next companion', '04 / Yeni yol arkadaşınız'),
  ],
};

export function storyFor(collection, locale) {
  return productStories[collection].map((item) => ({ ...item, title: locale === 'tr' ? item.trTitle : item.title, subtitle: locale === 'tr' ? item.trSubtitle : item.subtitle, label: locale === 'tr' ? item.trLabel : item.label }));
}
