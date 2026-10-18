import { pageMetadata } from "../_lib/seo";
import Link from "../_components/ui/localized-link";
import PolicyPage, { PolicySupportLink } from "../_components/ui/policy-page";

export const metadata = pageMetadata({ title: "Terms of Sale & Use — EsteeHouse", path: "/terms", noindex: true });

const sections = [
  { id: "the-house", title: "The house & the seller", paragraphs: [
    "EsteeHouse is the proposed parent brand for EsteeBags, our handmade bag collection, and EsteeGold, our handmade silver collection. These collection names are not separate registered companies or a statement that all silver pieces contain gold.",
    <>The business is being prepared in Türkiye. A registered company has not yet been confirmed. The legal seller&apos;s name, lawful trading status, business address and required registration/contact details must be completed before these terms can be used for live sales. For enquiries: <PolicySupportLink />.</>,
  ] },
  { id: "product-information", title: "Handmade product information", paragraphs: [
    "Product descriptions should identify materials, measurements, available options and whether a piece is ready to ship or made to order. Natural variations in handmade work may occur, but this does not excuse an item that is faulty or materially different from its description.",
    "Photographs illustrate the piece; screen settings can affect colour. Any meaningful variation, metal content, finish, stone choice or agreed custom detail must be explained accurately before purchase.",
  ] },
  { id: "prices-and-payment", title: "Prices & full prepayment", paragraphs: [
    "Our chosen model is full payment at checkout for ready-to-ship and made-to-order pieces, not a deposit plan. Production for a made-to-order piece starts after successful payment and confirmation of the required details. Full prepayment does not make an otherwise refundable item non-refundable.",
    "Prices may be displayed by country and currency. The agreed product price, delivery charge, relevant taxes and any disclosed import-charge arrangement must be clear before payment. An incorrect IP-based country estimate should be queried before ordering.",
    "The current site uses an iyzico hosted-payment integration. Merchant approval, legal seller setup and final shipping calculations remain launch requirements. A payment-screen integration is not proof that live sales are approved. Never send your card number, security code or one-time bank password by email.",
  ] },
  { id: "order-confirmation", title: "Order details & timing", paragraphs: [
    "Before a paid order is accepted, the product specification, availability, production estimate, delivery destination, total payable and seller details must be confirmed. The final pre-contract information and distance-sales agreement must be provided in a form you can keep.",
    <>The planned dispatch target is one business day for in-stock pieces. The estimated made-to-order delivery window is 10–14 business days including production and carrier transit, not an additional transit allowance. See <Link href="/shipping">Shipping & Delivery</Link>. Orders must not be left open indefinitely if we cannot fulfil them.</>,
  ] },
  { id: "returns-and-consumer-rights", title: "Returns & consumer rights", paragraphs: [
    <>See <Link href="/returns">Returns & Refunds</Link> for the proposed 14-day standard return policy and the distinction between standard and genuinely personalised work. Nothing in these drafts excludes mandatory rights for faulty, incorrect or misdescribed goods.</>,
    "The business is based in Türkiye. Any governing-law clause in the final agreement must preserve mandatory consumer protections and available complaint routes in the customer's applicable jurisdiction. This draft does not impose exclusive Istanbul court jurisdiction on consumers.",
  ] },
  { id: "using-the-website", title: "Using this website", paragraphs: [
    "Use the website lawfully. Do not interfere with its security, misuse another person's account, submit fraudulent orders or copy material for unauthorised commercial use. Rights in photographs, designs, text and other material remain with their respective owners.",
    <>Keep your account details secure and contact us if you suspect unauthorised access. Read <Link href="/privacy">Privacy & Storage</Link> to understand account, order and browser information.</>,
  ] },
  { id: "questions-and-updates", title: "Questions & updates", paragraphs: [
    <>Please raise a concern with <PolicySupportLink /> so we can try to resolve it. This does not prevent you from using the consumer authorities, courts or other remedies available to you.</>,
    "We may revise website information for future use. A later edit does not retrospectively remove rights or rewrite the terms of an existing order. These pages remain marked for owner review until the seller details, operations and legal review are complete.",
  ] },
];

export default function TermsPage() {
  return <PolicyPage currentPath="/terms" title="Terms of Sale & Use" introduction="The proposed framework for shopping with EsteeHouse. Honest product information, transparent payment and protected consumer rights." sections={sections} />;
}
