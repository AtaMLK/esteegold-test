"use client";

import { ArrowUpRight } from "lucide-react";

export default function FooterSubscribe() {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <input type="email" placeholder="Your email" aria-label="Email address" required />
      <button type="submit" aria-label="Subscribe"><ArrowUpRight size={18} /></button>
    </form>
  );
}
