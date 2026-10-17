import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import "../_components/ui/house-experience.css";

export const metadata = {
  title: "The House — Bags & Silver | EsteeHouse",
  description: "Two materials. One point of view. Discover the world of EsteeHouse, where handmade bags and silver pieces share an attention to character and detail.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="house-experience story-page">
      <section className="journey-chapter journey-chapter--opening">
        <div className="journey-watermark" aria-hidden="true">THE HOUSE</div>
        <div className="journey-copy"><p className="house-eyebrow">01 / Behind the objects</p><h1>Different materials.<br /><em>One instinct.</em></h1><p className="journey-description">A knot. A curve. The way light meets a surface. EsteeHouse brings handmade bags and silver together through an attention to the small things.</p><a href="#our-approach" className="house-text-link">A closer look <ArrowUpRight size={16} /></a></div>
        <figure className="journey-figure"><div className="journey-image"><Image src="/images/bags/bag3.jpg" alt="Handmade bag with visible woven texture" fill sizes="(max-width: 700px) 75vw, 43vw" priority className="journey-photo" /></div><figcaption><span>EsteeHouse / The studio</span><span>Objects with character ↗</span></figcaption></figure>
      </section>
      <section className="story-manifesto" id="our-approach"><p className="house-eyebrow">02 / Our point of view</p><div><h2>Less ordinary.<br /><em>More personal.</em></h2><p>We are drawn to objects that have something to say. A bag whose construction is part of its character. A silver piece whose shape becomes familiar with wear. Different ways of making, connected by the same feeling.</p><p>Not everything needs to be perfect to feel considered. The texture, the proportion, the small detail you notice later: that is where an object becomes yours.</p></div></section>
      <section className="story-collections" aria-label="Two collections, one house">
        <Link href="/bags" className="story-collection"><div className="story-collection-media"><Image src="/images/bags/bag18.jpg" alt="A bag from the handmade collection" fill sizes="(max-width: 700px) 84vw, 40vw" /></div><div className="story-collection-copy"><div><h2>The bags.</h2><p>A story in every knot.</p></div><ArrowUpRight size={24} /></div></Link>
        <Link href="/silver" className="story-collection"><div className="story-collection-media"><Image src="/images/Products-page/rings-title.jpg" alt="A study of ring shapes from the house image archive" fill sizes="(max-width: 700px) 84vw, 40vw" /></div><div className="story-collection-copy"><div><h2>The silver.</h2><p>A conversation with light.</p></div><ArrowUpRight size={24} /></div></Link>
      </section>
      <section className="house-closing"><p className="house-eyebrow">03 / A note to the house</p><h2>Every good thing<br /><em>starts somewhere.</em></h2><div className="house-closing-bottom"><p>A question about a piece, an idea, or a collaboration.<br />We would like to hear from you.</p><Link href="/contact" className="house-text-link">Start a conversation <ArrowUpRight size={18} /></Link></div></section>
    </main>
  );
}
