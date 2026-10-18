"use client";

import { useAppearance } from "../context/appearanceContext";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowUpRight, Instagram, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { supportEmail } from "../_lib/store-contact";
import "./contact.css";

const DynamicMap = dynamic(() => import("../_components/ui/map"), { ssr: false });
const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();

export default function ContactPage() {
  const { translateText } = useAppearance();
  const [sent, setSent] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function update(name, value) { setForm((current) => ({ ...current, [name]: value })); }

  function submit(event) {
    event.preventDefault();
    const subject = encodeURIComponent(form.subject || translateText("EsteeHouse enquiry"));
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-top"><span>{translateText("ESTEEHOUSE / CONTACT")}</span><span>ISTANBUL / 2026</span></div>
        <div className="contact-hero-copy"><p>{translateText("We would like to hear from you.")}</p><h1>{translateText("Start a")}<br /><em>{translateText("conversation.")}</em></h1></div>
        <div className="contact-hero-image"><Image src="/images/bags/bag3.jpg" alt={translateText("A close look at the texture of a handmade bag")} fill sizes="(max-width: 700px) 60vw, 30vw" priority /></div>
        <div className="contact-hero-bottom"><span>{translateText("For orders, wholesale, collaborations or simply a question.")}</span><span>↓ 01 / 03</span></div>
      </section>

      <section className="contact-body">
        <div className="contact-info">
          <p className="contact-label">{translateText("01 / THE STUDIO")}</p>
          <h2>{translateText("Come say")}<br /><em>{translateText("hello.")}</em></h2>
          <div className="contact-details">
            <a href={`mailto:${supportEmail}`}><Mail size={15} /> {supportEmail}</a>
            {instagramUrl && <a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={15} /> Instagram</a>}
            <span><MapPin size={15} /> Istanbul, Türkiye</span>
          </div>
          <div className="contact-map">
            {mapLoaded ? <DynamicMap lat={41.0082} lng={28.9784} zoom={10.5} /> : <div className="contact-map-preview"><span className="contact-map-kicker">{translateText("A window onto our city")}</span><h3>{translateText("Istanbul,")}<br/><em>{translateText("in colour.")}</em></h3><button type="button" onClick={() => setMapLoaded(true)}>{translateText("Load interactive map")}<ArrowUpRight size={16}/></button><p>{translateText("Loading the map connects to OpenFreeMap and shares your IP address with its service. No device-location permission is requested.")}</p><a href="https://openfreemap.org/privacy/" target="_blank" rel="noreferrer">{translateText("Map provider privacy ↗")}</a></div>}
          </div>
          <p className="contact-map-note">{translateText("City view only—not a public studio or visiting address.")}<a href="https://www.openstreetmap.org/#map=11/41.0082/28.9784" target="_blank" rel="noreferrer">{translateText("Open city map ↗")}</a></p>
        </div>

        <div className="contact-form-wrap">
          <div><p className="contact-label">{translateText("02 / SEND A NOTE")}</p><p className="contact-form-intro">{translateText("Tell us what you are looking for. This form prepares a message in your email app; it does not send or store your message on this website.")}</p></div>
          <form onSubmit={submit} className="contact-form">
            <label><span>{translateText("Your name")}</span><input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder={translateText("Your name")} /></label>
            <label><span>{translateText("Email address")}</span><input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" /></label>
            <label><span>{translateText("Subject")}</span><input value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder={translateText("Wholesale, order, collaboration…")} /></label>
            <label><span>{translateText("Message")}</span><textarea required value={form.message} onChange={(e) => update("message", e.target.value)} placeholder={translateText("Tell us a little more…")} rows={6} /></label>
            <button type="submit" className="contact-submit">{sent ? translateText("Opening your email client…") : translateText("Prepare email")}<ArrowUpRight size={16} /></button>
          </form>
        </div>
      </section>

      <section className="contact-bottom"><p className="contact-label">{translateText("03 / OTHER ENQUIRIES")}</p><div><h2>{translateText("Looking for something")}<br /><em>{translateText("specific?")}</em></h2><a href={`mailto:${supportEmail}`}>{translateText("Email the studio")}<ArrowUpRight size={16} /></a></div></section>
    </main>
  );
}
