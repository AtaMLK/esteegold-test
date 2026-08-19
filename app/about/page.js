import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import "./about.css";

export const metadata = { title: "About — EsteeHouse" };

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <video className="about-hero-media" autoPlay muted loop playsInline poster="/images/about.JPG">
          <source src="/video/about.mp4" type="video/mp4" />
        </video>
        <div className="about-hero-overlay" />
        <div className="about-hero-top"><span>ESTEEHOUSE / ABOUT</span><span>ISTANBUL / 2026</span></div>
        <div className="about-hero-bottom"><p>Jewelry / accessories / handmade bags</p><h1>Made with<br /><em>character.</em></h1><span className="about-scroll"><ArrowDownRight size={16} /> Scroll</span></div>
      </section>

      <section className="about-intro">
        <div><p className="about-label">01 / THE HOUSE</p></div>
        <div><h2>Different materials.<br /><em>One point of view.</em></h2><p>EsteeHouse brings together two ways of making: EsteeGold, our jewelry and accessories collection, and EsteeBags, our handmade bag line. The materials change. The attention does not.</p></div>
      </section>

      <section className="about-duo">
        <div className="about-duo-image"><img src="/images/Hero-bg-4.jpg" alt="EsteeGold detail" /></div>
        <div className="about-duo-copy"><p className="about-label">02 / ESTEEGOLD</p><h2>Quiet pieces.<br /><em>Strong details.</em></h2><p>We design jewelry and accessories around proportion, texture and the small details that make an object feel personal. The goal is not noise. It is recognition.</p><Link href="/gold">Explore EsteeGold <ArrowUpRight size={15} /></Link></div>
      </section>

      <section className="about-duo about-duo-reverse">
        <div className="about-duo-copy"><p className="about-label">03 / ESTEEBAGS</p><h2>Let the weave<br /><em>tell the story.</em></h2><p>Our bags keep the hand visible: knots, colour, texture and the tiny differences that happen when something is made rather than mass-produced.</p><Link href="/bags">Explore EsteeBags <ArrowUpRight size={15} /></Link></div>
        <div className="about-duo-image"><img src="/images/bags/bag1.jpg" alt="Handmade EsteeBag" onError={(event) => { event.currentTarget.src = "/images/Hero-bg-3.jpg"; }} /></div>
      </section>

      <section className="about-manifesto"><p className="about-label">04 / OUR APPROACH</p><h2>We make things<br /><em>worth keeping.</em></h2><div><span>Objects with character.</span><span>Details with a reason.</span><Link href="/contact">Talk to the studio <ArrowUpRight size={15} /></Link></div></section>
    </main>
  );
}
