"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, LucideInstagram } from "lucide-react";
import "./footer.css";

const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <footer className="footer-container">
      <div className="footer-topline"><span>ESTEEHOUSE</span><span>ISTANBUL / 2026</span></div>
      <div className="footer-main">
        <div className="footer-brand"><h2>Made to be<br /><em>kept.</em></h2><p>Objects with character.<br />Details with a reason.</p></div>
        <div className="footer-columns">
          <div><span className="footer-label">Navigate</span><Link href="/">Home</Link><Link href="/gold">EsteeGold</Link><Link href="/bags">EsteeBags</Link><Link href="/categories">Collection</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></div>
          <div><span className="footer-label">Customer care</span><Link href="/shipping">Shipping</Link><Link href="/returns">Returns & refunds</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link>{instagramUrl ? <a href={instagramUrl} target="_blank" rel="noreferrer"><LucideInstagram size={16}/> Instagram</a> : <span>Instagram</span>}</div>
        </div>
      </div>
      <div className="footer-subscribe"><div><span className="footer-label">Private notes</span><p>Occasional pieces, studio stories and first access.</p></div><form onSubmit={(e)=>{e.preventDefault();if(email.trim())setSent(true)}}>{sent?<span>Thank you — you are on the list.</span>:<><input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required placeholder="Your email address" aria-label="Email address"/><button type="submit" aria-label="Subscribe"><ArrowUpRight size={16}/></button></>}</form></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} EsteeHouse — EsteeGold / EsteeBags</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
    </footer>
  );
}
