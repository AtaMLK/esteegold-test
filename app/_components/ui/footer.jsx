"use client";

import { useAppearance } from "../../context/appearanceContext";

import Link from "./localized-link";
import { ArrowUpRight, LucideInstagram } from "lucide-react";
import "./footer.css";

const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();

export default function Footer() {
  const { translateText } = useAppearance();
  return (
    <footer className="footer-container">
      <div className="footer-topline"><span>ESTEEHOUSE</span><span>ISTANBUL / 2026</span></div>
      <div className="footer-main">
        <div className="footer-brand"><h2>{translateText("Made to be")}<br /><em>{translateText("kept.")}</em></h2><p>{translateText("Objects with character.")}<br />{translateText("Details with a reason.")}</p></div>
        <div className="footer-columns">
          <div><span className="footer-label">{translateText("Navigate")}</span><Link href="/">{translateText("Home")}</Link><Link href="/bags">EsteeBags</Link><Link href="/silver">EsteeGold</Link><Link href="/categories">{translateText("Collection")}</Link><Link href="/about">{translateText("About")}</Link><Link href="/contact">{translateText("Contact")}</Link></div>
          <div><span className="footer-label">{translateText("Customer care")}</span><Link href="/shipping">{translateText("Shipping")}</Link><Link href="/size-guide">{translateText("Size & material guide")}</Link><Link href="/returns">{translateText("Returns & refunds")}</Link><Link href="/terms">{translateText("Terms")}</Link><Link href="/privacy">{translateText("Privacy")}</Link>{instagramUrl ? <a href={instagramUrl} target="_blank" rel="noreferrer"><LucideInstagram size={16}/> Instagram</a> : <span>Instagram</span>}</div>
        </div>
      </div>
      <div className="footer-subscribe"><div><span className="footer-label">{translateText("A note to the house")}</span><p>{translateText("A piece, a question, a new idea. Our inbox is open.")}</p></div><Link href="/contact" className="footer-studio-link">{translateText("Speak to the studio")}<ArrowUpRight size={22} /></Link></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} EsteeHouse — EsteeBags / EsteeGold</span><div><Link href="/privacy">{translateText("Privacy")}</Link><Link href="/terms">{translateText("Terms")}</Link></div></div>
    </footer>
  );
}
