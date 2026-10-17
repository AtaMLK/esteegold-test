import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ScrollJourney from "./scroll-journey";
import RadialGallery from "./radial-gallery";
import "./house-experience.css";

export default function Main() {
  return (
    <main className="house-experience">
      <ScrollJourney />
      <RadialGallery />
      <section className="house-closing" aria-labelledby="house-closing-title">
        <p className="house-eyebrow">Two collections. One point of view.</p>
        <h2 id="house-closing-title">A little different.<br /><em>Entirely yours.</em></h2>
        <div className="house-closing-bottom">
          <p>Jewelry to live in. Bags to take everywhere.<br />Objects with a character of their own.</p>
          <Link href="/categories" className="house-text-link">Find your piece <ArrowUpRight size={18} /></Link>
        </div>
      </section>
    </main>
  );
}
