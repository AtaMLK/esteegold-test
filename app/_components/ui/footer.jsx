import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      ["EsteeGold", "/gold"],
      ["EsteeBags", "/bags"],
      ["All products", "/categories"],
    ],
  },
  {
    title: "House",
    links: [
      ["About EsteeHouse", "/about"],
      ["Contact", "/contact"],
      ["Order tracking", "/profile"],
    ],
  },
  {
    title: "Customer care",
    links: [
      ["Shipping & delivery", "/shipping"],
      ["Returns & refunds", "/returns"],
      ["Terms of use", "/terms"],
      ["Privacy policy", "/privacy"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[var(--ink)] px-5 pb-6 pt-14 text-[var(--paper)] md:px-8 md:pt-20">
      <div className="grid gap-12 md:grid-cols-[1.6fr_repeat(3,1fr)] md:gap-8">
        <div>
          <p className="font-serif text-[clamp(3.2rem,7vw,7rem)] leading-[0.78] tracking-[-0.065em]">
            EsteeHouse
          </p>
          <p className="mt-7 max-w-sm text-xs leading-6 text-white/55">
            A creative house for jewelry, accessories and handmade bags — made with character, not in a hurry.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="mb-5 text-[9px] uppercase tracking-[0.28em] text-white/35">
              {column.title}
            </p>
            <div className="flex flex-col gap-2.5">
              {column.links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="w-fit text-sm text-white/80 transition hover:text-white hover:translate-x-1"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-5 text-[8px] uppercase tracking-[0.22em] text-white/35 md:flex-row md:items-center md:justify-between">
        <span>ESTEEHOUSE — ESTEEGOLD / ESTEEBAGS</span>
        <span>© {new Date().getFullYear()} EsteeHouse</span>
      </div>
    </footer>
  );
}
