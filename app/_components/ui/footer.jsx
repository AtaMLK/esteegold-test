"use client";

import Link from "next/link";
import { ArrowUpRight, LucideInstagram } from "lucide-react";
import "./footer.css";

const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-topline"><span>ESTEEHOUSE</span><span>ISTANBUL / 2026</span></div>
      <div className="footer-main">
        <div className="footer-brand"><h2>Made to be<br /><em>kept.</em></h2><p>Objects with character.<br />Details with a reason.</p></div>
        <div className="footer-columns">
          <div><span className="footer-label">Navigate</span><Link href="/">Home</Link><Link href="/bags">Bags</Link><Link href="/silver">Silver</Link><Link href="/categories">Collection</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></div>
          <div><span className="footer-label">Customer care</span><Link href="/shipping">Shipping</Link><Link href="/returns">Returns & refunds</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link>{instagramUrl ? <a href={instagramUrl} target="_blank" rel="noreferrer"><LucideInstagram size={16}/> Instagram</a> : <span>Instagram</span>}</div>
        </div>
      </div>
      <div className="footer-subscribe"><div><span className="footer-label">A note to the house</span><p>A piece, a question, a new idea. Our inbox is open.</p></div><Link href="/contact" className="footer-studio-link">Speak to the studio <ArrowUpRight size={22} /></Link></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} EsteeHouse — Bags / Silver</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
    </footer>
  );
}
