import { LucideCopyright, LucideInstagram } from "lucide-react";
import Link from "next/link";
import FooterSubscribe from "./FooterSubscribe";
import "./footer.css";

const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-topline"><span>ESTEE GOLD STUDIO</span><span>ISTANBUL / 2026</span></div>
      <div className="footer-main">
        <div className="footer-brand"><h2>Made to be<br /><em>kept.</em></h2><p>Objects with character.<br />Details with a reason.</p></div>
        <div className="footer-columns">
          <div><span className="footer-label">Navigate</span><Link href="/">Home</Link><Link href="/product">Collection</Link><Link href="/categories">Categories</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></div>
          <div><span className="footer-label">Connect</span>{instagramUrl ? <a href={instagramUrl} target="_blank" rel="noreferrer"><LucideInstagram size={16} /> Instagram</a> : <span>Instagram</span>}<a href="mailto:hello@esteegoldstudio.com">Email ↗</a></div>
        </div>
      </div>
      <div className="footer-subscribe"><div><span className="footer-label">Private notes</span><p>Occasional pieces, studio stories and first access.</p></div><FooterSubscribe /></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Estee Gold Studio <LucideCopyright size={10} /> All rights reserved.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
    </footer>
  );
}
