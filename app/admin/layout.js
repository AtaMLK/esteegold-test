import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <aside className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-[var(--paper)]/95 px-3 py-3 backdrop-blur md:bottom-auto md:top-0 md:h-screen md:w-56 md:border-r md:border-t-0 md:px-5 md:py-8">
        <Link href="/admin" className="hidden font-serif text-2xl tracking-[-.04em] md:block">EsteeHouse</Link>
        <p className="mt-10 hidden text-[8px] uppercase tracking-[.25em] text-black/35 md:block">Back office</p>
        <nav className="flex items-center justify-around gap-1 md:mt-5 md:flex-col md:items-stretch md:gap-1">
          <AdminLink href="/admin" label="Dashboard" />
          <AdminLink href="/admin/catalog" label="Catalog" />
          <AdminLink href="/admin/orders" label="Orders" />
          <AdminLink href="/admin/customers" label="Customers" />
          <AdminLink href="/admin/inventory" label="Inventory" />
        </nav>
        <Link href="/" className="hidden md:block mt-10 border-t border-black/10 pt-5 text-[8px] uppercase tracking-[.2em] text-black/40 hover:text-black">← Storefront</Link>
      </aside>
      <div className="md:pl-56">{children}</div>
    </div>
  );
}

function AdminLink({ href, label }) {
  return <Link href={href} className="rounded-full px-3 py-2 text-center text-[8px] uppercase tracking-[.18em] hover:bg-black hover:text-white md:text-left">{label}</Link>;
}
