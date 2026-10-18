const silverImages = ["/images/Products-page/Ring.jpg", "/images/Products-page/rings-title.jpg", "/images/Products-page/Bracelets.jpg", "/images/Products-page/Combinations.jpg"];
const bagImages = ["/images/bags/bag1.jpg", "/images/bags/bag3.jpg", "/images/bags/bag18.jpg", "/images/bags/bag8.jpg", "/images/bags/bag12.jpg", "/images/bags/bag5.jpg", "/images/bags/bag10.jpg", "/images/bags/bag16.jpg"];

export const collectionLinks = [
  { key: "house", label: "The house", href: "/" },
  { key: "bags", label: "EsteeBags", href: "/bags" },
  { key: "silver", label: "EsteeGold", href: "/silver" },
];

export const collections = {
  house: { name: "EsteeHouse", eyebrow: "EsteeBags & EsteeGold / One house", watermark: "ESTEEHOUSE", shop: "/categories", shopLabel: "Explore both collections", closing: "Different materials.", closingEmphasis: "The same instinct.", note: "Handmade bags and silver pieces. Two expressions of the same attention to detail.", other: "bags" },
  bags: { name: "EsteeBags", eyebrow: "EsteeBags / Handmade bags", watermark: "ESTEEBAGS", shop: "/categories?branch=bags", shopLabel: "Explore EsteeBags", closing: "A story in", closingEmphasis: "every knot.", note: "A new shape for your everyday. Explore the bags, or discover the other side of the house.", other: "silver" },
  silver: { name: "EsteeGold", eyebrow: "EsteeGold / Handmade silver", watermark: "ESTEEGOLD", shop: "/categories?branch=silver", shopLabel: "Explore EsteeGold", closing: "Not just worn.", closingEmphasis: "Made personal.", note: "Follow a shape, a reflection, a detail. Find a silver piece that feels like you.", other: "bags" },
};

const positions = [[0, 0], [0, 1.2], [1.2, 2], [2.65, 2], [3.85, 1], [4.95, 1.7], [6.05, 1.05], [6.05, 2.3]];
const layouts = ["opening", "detail", "gold", "bags", "process", "color", "everyday", "finale"];
const stories = {
  house: [
    ["The house", "Objects with", "character.", "Handmade bags and silver. Different materials. The same instinct to make something personal.", bagImages[0], "/bags", "Step into bags"],
    ["EsteeGold / Handmade silver", "A conversation", "with light.", "A shape that catches the eye. A detail that stays with you. Discover the silver side of the house.", silverImages[0], "/silver", "Step into silver"],
    ["A closer look", "Small things.", "A lasting feeling.", "The curve of a ring. The rhythm of a surface. Objects that become part of your everyday.", silverImages[1], "/categories?branch=silver", "Explore silver"],
    ["EsteeBags / Handmade bags", "Made by hand.", "Carried your way.", "Tactile, a little unexpected, and unmistakably handmade. There is a story in every knot.", bagImages[2], "/categories?branch=bags", "Explore bags"],
    ["The process", "Leave room", "for the hand.", "Texture you can see. Detail you can feel. The small irregularities are part of the character.", bagImages[1], "/about", "Inside the house"],
    ["A different rhythm", "A quiet kind", "of presence.", "An expressive shape does not need to shout. Sometimes the smallest detail says the most.", silverImages[2], "/silver", "Discover the silver story"],
    ["The everyday", "Take it out.", "Make it yours.", "The best pieces do not wait for an occasion. They become part of the way you move through the world.", bagImages[3], "/bags", "Discover the bag story"],
    ["Your point of view", "Some things", "stay with you.", "Choose a material. Follow a feeling. Find your own way through the house.", silverImages[3], "#collection", "Explore the house edit"],
  ],
  bags: [
    ["EsteeBags / Handmade bags", "Follow your", "own thread.", "Handmade bags with texture, colour and a character of their own. A little unexpected. Entirely yours.", bagImages[0]],
    ["The texture", "A feeling you", "can carry.", "Look closer at the weave. Every crossing of a cord becomes part of the shape.", bagImages[1]],
    ["The silhouette", "Soft lines.", "Strong character.", "The silhouette makes the first impression. The details are what make you look again.", bagImages[2]],
    ["The colour", "An everyday", "of your own.", "A colour to build a day around. A texture that makes an ordinary moment feel considered.", bagImages[3]],
    ["The making", "The hand is", "in the detail.", "The construction stays visible: knots, curves and small variations. It is part of the design, not something to hide.", bagImages[4], "/about", "Meet the house"],
    ["The unexpected", "Turn a", "different corner.", "A familiar object, seen another way. Follow the shape that feels most like you.", bagImages[5]],
    ["The companion", "Out the door.", "Into your day.", "For unplanned afternoons and familiar routes. A bag becomes personal when you carry it your way.", bagImages[6]],
    ["The bag edit", "Find your", "next companion.", "Take a closer look at the shapes, colours and textures in the bag collection.", bagImages[7], "#collection", "Explore the bag edit"],
  ],
  silver: [
    ["EsteeGold / Handmade silver", "A little light.", "A lasting feeling.", "Expressive silver pieces, considered proportions and details that feel personal. Welcome to the quieter side of the house.", silverImages[0]],
    ["The form", "Follow the", "curve.", "A line becomes a shape. A shape becomes something you reach for, again and again.", silverImages[1]],
    ["The detail", "Quiet, never", "ordinary.", "Look closely. A change in texture, a different edge, a reflection that moves with you.", silverImages[2]],
    ["The combination", "Your way", "of wearing it.", "One piece on its own, or a conversation between a few. There is no single way to make it yours.", silverImages[3]],
    ["The point of view", "Considered", "from every side.", "We are drawn to the details that make an object feel personal. Proportion. Texture. The way it sits against the skin.", silverImages[1], "/about", "Inside the house"],
    ["The reflection", "Let the light", "find you.", "A subtle accent. A different rhythm. A small way to change the feeling of your everyday.", silverImages[2]],
    ["The everyday", "Wear it often.", "Keep it close.", "The pieces that stay with us are the ones that become part of our story.", silverImages[3]],
    ["The silver edit", "Find what", "feels like you.", "Explore the silver collection and discover your own combination of shapes and details.", silverImages[0], "#collection", "Explore the silver edit"],
  ],
};

export function getChapters(collection = "house") {
  const config = collections[collection];
  return stories[collection].map(([label, title, emphasis, description, image, href, link], index) => ({ label, title, emphasis, description, image, alt: `${config.name} editorial — ${label.toLowerCase()}`, href: href || config.shop, link: link || config.shopLabel, x: positions[index][0], y: positions[index][1], layout: layouts[index] }));
}

export function getGalleryPieces(collection = "house") {
  const bagNames = ["The everyday weave", "Texture, carried", "A different rhythm", "The softer side", "Knotted by hand", "A little colour", "The daily companion", "Your own thread"];
  const silverNames = ["A study in shape", "Follow the curve", "A quiet presence", "Better together"];
  const bags = bagImages.map((image, index) => ({ name: bagNames[index], category: "EsteeBags / Handmade bags", image, href: collections.bags.shop }));
  const silver = [...silverImages, ...silverImages].map((image, index) => ({ name: silverNames[index % 4] + (index > 3 ? " / II" : ""), category: "EsteeGold / Handmade silver", image, href: collections.silver.shop }));
  return collection === "bags" ? bags : collection === "silver" ? silver : [silver[0], bags[0], silver[1], bags[1], silver[2], bags[2], silver[3], bags[3]];
}
