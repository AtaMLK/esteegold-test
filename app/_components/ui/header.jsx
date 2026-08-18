"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, Search, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "../../context/cartContext";

const navItems = [
  { label: "EsteeGold", href: "/gold" },
  { label: "EsteeBags", href: "/bags" },
  { label: "All products", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-7 md:py-6">
        <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.22em] text-[var(--ink)]">
          <Link href="/" className="group relative z-[70] flex items-center gap-3">
            <span className="font-serif text-xl tracking-[-0.04em] normal-case md:text-2xl">EsteeHouse</span>
            <span className="hidden border-l border-current/30 pl-3 text-[8px] tracking-[0.3em] opacity-60 sm:block">EST. / HANDMADE</span>
          </Link>
          <div className="relative z-[70] flex items-center gap-2 md:gap-3">
            <button aria-label="Search" onClick={() => setSearchOpen((value) => !value)} className="hidden rounded-full border border-current/20 px-4 py-2 transition hover:bg-black hover:text-white md:flex md:items-center md:gap-2"><Search size={14} strokeWidth={1.5} /><span>Search</span></button>
            <Link href="/cart" className="relative flex items-center gap-2 rounded-full border border-current/20 px-3 py-2 transition hover:bg-black hover:text-white" aria-label={`Shopping bag, ${itemCount} items`}><ShoppingBag size={15} strokeWidth={1.5} /><span className="hidden sm:inline">Bag</span><span className="min-w-4 text-center">{itemCount}</span></Link>
            <Link href="/profile" className="hidden rounded-full border border-current/20 p-2 transition hover:bg-black hover:text-white sm:block" aria-label="Account"><User size={15} strokeWidth={1.5} /></Link>
            <button onClick={() => setOpen((value) => !value)} className="rounded-full border border-current/25 bg-[color:var(--paper)]/80 p-2.5 backdrop-blur transition hover:bg-black hover:text-white" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? <X size={17} strokeWidth={1.5} /> : <MenuIcon size={17} strokeWidth={1.5} />}</button>
          </div>
        </div>
        <AnimatePresence>
          {searchOpen && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-4 top-20 z-[60] w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-black/10 bg-[var(--paper)] p-4 shadow-2xl md:right-7"><div className="flex items-center gap-3 border-b border-black/15 pb-3"><Search size={17} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search EsteeHouse..." className="w-full bg-transparent text-sm outline-none placeholder:text-black/35" /></div><div className="pt-3 text-[10px] uppercase tracking-[0.18em] text-black/45">{query ? `Search for “${query}”` : "Jewelry · bags · accessories"}</div></motion.div>}
        </AnimatePresence>
      </header>
      <AnimatePresence>
        {open && <motion.div initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-40 overflow-hidden bg-[var(--paper)]"><div className="grid min-h-full grid-cols-1 md:grid-cols-[1.1fr_0.9fr]"><div className="flex flex-col justify-end p-6 pb-10 pt-28 md:p-12 md:pb-14"><p className="mb-5 text-[9px] uppercase tracking-[0.28em] text-black/45">The house / collections</p><nav className="flex flex-col">{navItems.map((item, index) => <Link key={item.href} href={item.href} className="group flex items-baseline gap-4 border-b border-black/10 py-2.5 md:py-3"><span className="w-5 text-[8px] text-black/35">0{index + 1}</span><span className="font-serif text-[clamp(2.7rem,6vw,6.5rem)] leading-[0.9] tracking-[-0.055em] transition-transform duration-500 group-hover:translate-x-3">{item.label}</span></Link>)}</nav></div><div className="relative hidden overflow-hidden bg-black md:block"><div className="absolute inset-0 bg-[url('/images/menu-bg.jpg')] bg-cover bg-center opacity-80 transition-transform duration-[1200ms] hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" /><div className="absolute bottom-12 left-10 right-10 text-white"><p className="text-[9px] uppercase tracking-[0.3em] opacity-60">EsteeHouse</p><p className="mt-4 max-w-md font-serif text-4xl leading-none tracking-[-0.04em]">Two ways of making.<br />One house.</p><div className="mt-8 flex gap-8 text-[9px] uppercase tracking-[0.22em] opacity-75"><span>EsteeGold</span><span>EsteeBags</span></div></div></div></div></motion.div>}
      </AnimatePresence>
    </>
  );
}
