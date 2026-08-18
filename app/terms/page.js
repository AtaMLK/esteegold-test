export const metadata = { title: "Terms of Use — EsteeHouse" };

export default function TermsPage() {
  return <LegalPage title="Terms of Use" eyebrow="Customer care / 01" sections={["Introduction", "Orders and pricing", "Payment", "Intellectual property", "Changes to these terms"]} />;
}

function LegalPage({ title, eyebrow, sections }) {
  return <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-36 md:px-10"><div className="max-w-5xl"><p className="text-[9px] uppercase tracking-[0.28em] text-black/40">{eyebrow}</p><h1 className="mt-6 font-serif text-[clamp(4rem,10vw,10rem)] leading-[0.76] tracking-[-0.07em]">{title}</h1><div className="mt-16 grid gap-10 border-t border-black/10 pt-10 md:grid-cols-[0.4fr_1fr]">{sections.map((section) => <section key={section}><h2 className="font-serif text-3xl tracking-[-0.03em]">{section}</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-black/55">This section is intentionally editable. Replace this placeholder with the final EsteeHouse policy text before launch.</p></section>)}</div></div></main>;
}
