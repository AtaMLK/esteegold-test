"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight, Instagram, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import "./contact.css";

const DynamicMap = dynamic(() => import("../_components/ui/map"), { ssr: false });

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function update(name, value) { setForm((current) => ({ ...current, [name]: value })); }

  function submit(event) {
    event.preventDefault();
    const subject = encodeURIComponent(form.subject || "EsteeHouse enquiry");
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:hello@esteegoldstudio.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-top"><span>ESTEEHOUSE / CONTACT</span><span>ISTANBUL / 2026</span></div>
        <div className="contact-hero-copy"><p>We would like to hear from you.</p><h1>Start a<br /><em>conversation.</em></h1></div>
        <div className="contact-orbit orbit-contact-a" /><div className="contact-orbit orbit-contact-b" />
        <div className="contact-hero-bottom"><span>For orders, wholesale, collaborations or simply a question.</span><span>↓ 01 / 03</span></div>
      </section>

      <section className="contact-body">
        <div className="contact-info">
          <p className="contact-label">01 / THE STUDIO</p>
          <h2>Come say<br /><em>hello.</em></h2>
          <div className="contact-details">
            <a href="mailto:hello@esteegoldstudio.com"><Mail size={15} /> hello@esteegoldstudio.com</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={15} /> Instagram</a>
            <span><MapPin size={15} /> Istanbul, Türkiye</span>
          </div>
          <div className="contact-map"><DynamicMap lat={41.102856} lng={28.984782} zoom={15} /></div>
        </div>

        <div className="contact-form-wrap">
          <div><p className="contact-label">02 / SEND A NOTE</p><p className="contact-form-intro">Tell us what you are looking for. We will take it from there.</p></div>
          <form onSubmit={submit} className="contact-form">
            <label><span>Your name</span><input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" /></label>
            <label><span>Email address</span><input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" /></label>
            <label><span>Subject</span><input value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Wholesale, order, collaboration…" /></label>
            <label><span>Message</span><textarea required value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us a little more…" rows={6} /></label>
            <button type="submit" className="contact-submit">{sent ? "Opening your email client…" : "Send message"}<ArrowUpRight size={16} /></button>
          </form>
        </div>
      </section>

      <section className="contact-bottom"><p className="contact-label">03 / OTHER ENQUIRIES</p><div><h2>Looking for something<br /><em>specific?</em></h2><a href="mailto:hello@esteegoldstudio.com">Email the studio <ArrowUpRight size={16} /></a></div></section>
    </main>
  );
}
