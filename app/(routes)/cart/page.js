"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useCartStore } from "@/app/_lib/cartStore";
import "./cart.css";

const money = (value) => `€${Number(value || 0).toFixed(2)}`;

export default function CartPage() {
  const { items, hydrated, hydrate, removeItem, setQuantity, total, count } = useCartStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) return <main className="cart-page"><div className="cart-empty">Opening your collection…</div></main>;

  return (
    <main className="cart-page">
      <header className="cart-header">
        <div><p>ESTEE GOLD STUDIO / YOUR SELECTION</p><h1>Your pieces.</h1></div>
        <Link href="/product" className="cart-continue"><ArrowLeft size={14} /> Continue exploring</Link>
      </header>

      {items.length === 0 ? (
        <section className="cart-empty">
          <div><span>00</span><h2>Nothing here<br /><em>yet.</em></h2><p>Choose a piece from the collection and it will appear here.</p><Link href="/product">Explore collection <ArrowUpRight size={14} /></Link></div>
        </section>
      ) : (
        <section className="cart-layout">
          <div className="cart-list">
            {items.map((item, index) => (
              <article className="cart-line" key={item.id}>
                <div className="cart-line-index">{String(index + 1).padStart(2, "0")}</div>
                <Link href={`/product/${item.id}`} className="cart-line-image">
                  <Image src={item.image} alt={item.name || "Product"} fill sizes="180px" />
                </Link>
                <div className="cart-line-info">
                  <p>{item.material || "ESTEE GOLD OBJECT"}</p>
                  <h2>{item.name}</h2>
                  <span>{money(item.price)} each</span>
                </div>
                <div className="cart-line-quantity">
                  <button onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity"><Minus size={13} /></button>
                  <strong>{item.quantity}</strong>
                  <button onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity"><Plus size={13} /></button>
                </div>
                <strong className="cart-line-total">{money(item.price * item.quantity)}</strong>
                <button className="cart-remove" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={16} /></button>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <p className="cart-summary-kicker">THE CHECKOUT</p>
            <div className="cart-summary-count"><span>{count()}</span><p>pieces<br />selected</p></div>
            <div className="cart-summary-row"><span>Subtotal</span><strong>{money(total())}</strong></div>
            <div className="cart-summary-row"><span>Shipping</span><strong>Calculated at checkout</strong></div>
            <div className="cart-summary-total"><span>Total</span><strong>{money(total())}</strong></div>
            <Link href="/checkout" className="cart-checkout">Continue to checkout <ArrowUpRight size={16} /></Link>
            <p className="cart-summary-note">You can complete your purchase as a guest. Your selection is kept in this browser.</p>
          </aside>
        </section>
      )}
    </main>
  );
}
