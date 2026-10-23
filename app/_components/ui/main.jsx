import CollectionOverview from "./collection-overview";
import Link from "./localized-link";
import { ArrowUpRight } from "lucide-react";
import CinematicJourney from "./cinematic-journey";
import RadialGallery from "./radial-gallery";
import { collectionLabel } from "./collection-label";
import { getCollection } from "./house-content-tr";
import "./house-experience.css";

export default function Main({ collection = "house", locale = "en" }) {
  const config = getCollection(collection, locale);
  return (
    <main className={`house-experience house-experience--${collection}`}>
      <CinematicJourney key={collection} collection={collection} />
      <RadialGallery key={collection + "-gallery"} collection={collection} />
      <CollectionOverview collection={collection} locale={locale}/>
      <section className="house-closing" aria-labelledby="house-closing-title">
        <p className="house-eyebrow">{locale === "tr" ? "EsteeBags & EsteeGold. Ortak bir bakış." : "EsteeBags & EsteeGold. One point of view."}</p>
        <h2 id="house-closing-title">{config.closing}<br /><em>{config.closingEmphasis}</em></h2>
        <div className="house-closing-bottom">
          <p>{config.note}</p>
          <div className="house-closing-links"><Link href={config.shop} className="house-text-link">{config.shopLabel} <ArrowUpRight size={18} /></Link><Link href={`/${config.other}`} className="house-text-link">{locale === "tr" ? "Keşfedin:" : "Step into"} {collectionLabel(config.other)} <ArrowUpRight size={18} /></Link></div>
        </div>
        <span className="house-closing-note">{locale === "tr" ? "İki koleksiyon. Tek çatı." : "Two collections. One house."}</span>
      </section>
    </main>
  );
}
