import { pageMetadata } from "../_lib/seo";
import Link from "../_components/ui/localized-link";
import PolicyPage from "../_components/ui/policy-page";

export const metadata = pageMetadata({ title: "Shipping & Delivery — EsteeHouse", path: "/shipping", noindex: true });

const sections = [
  { id: "from-our-hands", title: "From our hands to yours", paragraphs: [
    "EsteeHouse pieces are handmade and dispatched from Türkiye. Some pieces are ready to ship; others are made after you order. Our made-to-order delivery window includes both making time and carrier transit.",
    "We plan to serve Türkiye and supported destinations across Europe, Asia, the Americas and Africa. Availability depends on the destination, carrier service, customs requirements and applicable restrictions. We cannot promise delivery to every country or postcode.",
  ] },
  { id: "ready-to-ship", title: "Ready-to-ship pieces", paragraphs: [
    "Our planned dispatch target for pieces physically in stock is within one business day after payment is confirmed. Dispatch means handing your parcel to the carrier, not delivery to your door.",
    "Business days are Monday to Friday, excluding Turkish public holidays. Orders received outside business days are handled on the next business day.",
  ] },
  { id: "made-to-order", title: "Made especially after your order", paragraphs: [
    "Our estimated made-to-order delivery window is 10–14 business days after full payment and confirmation of the design and any required details. This includes both production and carrier transit; transit is not added on top. We confirm that the destination and selected delivery service support this window before accepting the order.",
    "A standard design made after ordering is not automatically a personalised or bespoke item. Any genuine personalisation, such as engraving or a one-off design, must be clearly described before purchase.",
    "For a basket containing ready-to-ship and made-to-order pieces, our proposed approach is to send everything together when the final piece is ready. Please ask before payment if you need separate shipments; availability and any extra charge must be agreed first.",
  ] },
  { id: "shipping-charges", title: "Shipping charges", paragraphs: [
    "Our planned standard shipping service within Türkiye is free of charge. International shipping is not included in the product price and will depend on the destination and the parcel's packed weight and dimensions.",
    "International carrier rates are still being arranged. Please request a confirmed delivery quote before ordering internationally. We will not present an unconfirmed rate as free worldwide shipping or ask you to accept an undisclosed shipping charge after payment.",
  ] },
  { id: "customs-and-tracking", title: "Transit, customs & tracking", paragraphs: [
    "The carrier and tracking arrangements will be confirmed before launch. The 10–14 business-day estimate includes transit, but customs checks or exceptional disruptions can affect arrival. We will explain any problem and your available options rather than silently extending an order.",
    "International orders may attract destination import taxes, duties or clearance charges. Whether these are prepaid or payable by the recipient must be disclosed before payment. This arrangement is not yet finalised; please ask for a destination-specific quote.",
  ] },
  { id: "delivery-help", title: "If something goes wrong", paragraphs: [
    <>Contact us if a parcel is delayed, lost, damaged or delivered incorrectly. We will investigate with the carrier; dispatch does not remove our responsibility for delivery under applicable law. Read our <Link href="/returns">Returns & Refunds</Link> draft for the proposed remedy process.</>,
    "If we cannot meet an agreed timeframe, we will explain the situation and available options. Any revised date must respect your cancellation and refund rights; a delay does not require you to accept an indefinite wait.",
  ] },
];

export default function ShippingPage() {
  return <PolicyPage currentPath="/shipping" title="Shipping & Delivery" introduction="Made with care. Sent with clarity. A guide to making time, dispatch and the journey to your door." sections={sections} />;
}
