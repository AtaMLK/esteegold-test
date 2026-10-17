import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ScrollJourney from "./scroll-journey";
import RadialGallery from "./radial-gallery";
import { collections } from "./house-content";
import "./house-experience.css";

export default function Main({ collection = "house" }) {
  const config = collections[collection];
  return (
    <main className={`house-experience house-experience--${collection}`}>
      <ScrollJourney key={collection} collection={collection} />
      <RadialGallery key={collection + "-gallery"} collection={collection} />
      <section className="house-closing" aria-labelledby="house-closing-title">
        <p className="house-eyebrow">Bags & silver. One point of view.</p>
        <h2 id="house-closing-title">{config.closing}<br /><em>{config.closingEmphasis}</em></h2>
        <div className="house-closing-bottom">
          <p>{config.note}</p>
          <div className="house-closing-links"><Link href={config.shop} className="house-text-link">{config.shopLabel} <ArrowUpRight size={18} /></Link><Link href={`/${config.other}`} className="house-text-link">Step into {config.other} <ArrowUpRight size={18} /></Link></div>
        </div>
        <span className="house-closing-note">Two collections. One house.</span>
      </section>
    </main>
  );
}
