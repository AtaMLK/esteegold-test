import Link from "next/link";

export default function ProductNotFound() {
  return <main className="min-h-screen bg-[var(--paper)] px-6 pb-24 pt-36"><p className="text-xs uppercase tracking-widest">EsteeHouse / Product unavailable</p><h1 className="mt-8 font-serif text-6xl">This piece is not available.</h1><p className="mt-6 max-w-lg text-sm leading-7">The link may be incorrect, or the piece may no longer be in the current collection.</p><Link href="/categories" className="mt-8 inline-block underline underline-offset-4">Explore the current collection</Link></main>;
}
