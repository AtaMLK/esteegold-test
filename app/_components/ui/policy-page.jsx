"use client";

import Link from "./localized-link";
import { useAppearance } from "../../context/appearanceContext";
import { turkishPolicies } from "../../_lib/policies-tr";
import { supportEmail } from "../../_lib/store-contact";
import "./policy-page.css";

const policies = [
  { href: "/shipping", title: "Shipping & Delivery" },
  { href: "/returns", title: "Returns & Refunds" },
  { href: "/terms", title: "Terms of Sale & Use" },
  { href: "/privacy", title: "Privacy & Storage" },
];

export function PolicySupportLink() {
  return <a href={`mailto:${supportEmail}`}>{supportEmail}</a>;
}

export default function PolicyPage({ title, introduction, currentPath, sections }) {
  const { locale, translateText } = useAppearance();
  const translated = locale === "tr" ? turkishPolicies[currentPath] : null;
  const content = translated || { title, introduction, sections };
  return (
    <main className="policy-page">
      <header className="policy-heading">
        <p className="policy-eyebrow">{translateText("EsteeHouse / Customer care", "EsteeHouse / Müşteri desteği")}</p>
        <h1>{content.title}</h1>
        <p className="policy-introduction">{content.introduction}</p>
        <p className="policy-version">{translateText("Owner-review draft / 18 October 2026", "İşletme sahibinin incelemesine açık taslak / 18 Ekim 2026")}</p>
      </header>
      <aside className="policy-preview" aria-label={translateText("Policy draft status", "Politika taslağının durumu")}>
        <strong>{translateText("Pre-launch policy preview", "Açılış öncesi politika taslağı")}</strong>
        <p>{translateText("Seller identification, the business and returns address, carrier arrangements and international rates still need to be confirmed. These drafts are not final sale terms or confirmation that checkout is ready for live orders.", "Satıcı kimliği, iş ve iade adresi, taşıyıcı düzenlemeleri ve uluslararası ücretler henüz doğrulanmalıdır. Bu taslaklar nihai satış koşulları değildir ve ödemenin gerçek siparişlere hazır olduğunu doğrulamaz.")}</p>
      </aside>
      <div className="policy-layout">
        <nav className="policy-contents" aria-label={translateText("On this page", "Bu sayfada")}>
          <p className="policy-eyebrow">{translateText("On this page", "Bu sayfada")}</p>
          {content.sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}
        </nav>
        <div className="policy-sections">
          {content.sections.map((section) => (
            <section id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              {section.paragraphs.map((paragraph, index) => <p key={`${section.id}-${index}`}>{paragraph}</p>)}
            </section>
          ))}
        </div>
      </div>
      <div className="policy-help"><h2>{translateText("A question about your piece?", "Parçanız hakkında bir sorunuz mu var?")}</h2><p>{translateText("If anything is unclear, contact us before ordering:", "Belirsiz bir konu varsa siparişten önce bize yazın:")} <PolicySupportLink /></p></div>
      <nav className="policy-related" aria-label={translateText("Customer care policies", "Müşteri destek politikaları")}>
        {policies.map((policy) => <Link href={policy.href} key={policy.href} aria-current={currentPath === policy.href ? "page" : undefined}>{locale === "tr" ? turkishPolicies[policy.href].title : policy.title}<span aria-hidden="true">↗</span></Link>)}
      </nav>
    </main>
  );
}
