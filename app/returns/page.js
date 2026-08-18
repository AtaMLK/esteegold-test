export const metadata = { title: "Returns & Refunds — EsteeHouse" };

export default function ReturnsPage() {
  return <Policy title="Returns & Refunds" eyebrow="Customer care / 02" sections={["Eligibility", "Return process", "Refunds", "Exclusions"]} />;
}

function Policy({ title, eyebrow, sections }) {
  return <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-36 md:px-10"><div className="max-w-5xl"><p className="text-[9px] uppercase tracking-[0.28em] text-black/40">{eyebrow}</p><h1 className="mt-6 font-serif text-[clamp(4rem,10vw,10rem)] leading-[0.76] tracking-[-0.07em]">{title}</h1><div className="mt-16 grid gap-10 border-t border-black/10 pt-10 md:grid-cols-2">{sections.map((section) => <section key={section}><h2 className="font-serif text-3xl">{section}</h2><p className="mt-4 text-sm leading-7 text-black/55">Editable EsteeHouse placeholder. Replace with the final return and refund terms before launch.</p></section>)}</div></div></main>;
}
