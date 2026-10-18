import { pageMetadata } from "../_lib/seo";
import PolicyPage, { PolicySupportLink } from "../_components/ui/policy-page";

export const metadata = pageMetadata({ title: "Returns & Refunds — EsteeHouse", path: "/returns", noindex: true });

const sections = [
  { id: "standard-pieces", title: "Standard pieces", paragraphs: [
    "Our proposed standard policy is a 14-day change-of-mind return window from receipt for eligible pieces, including standard designs made after ordering. Being handmade does not, by itself, make a product non-returnable.",
    "You may inspect a piece as you would in a shop. Please avoid wearing or using it beyond what is needed to check its nature, characteristics and fit. Any lawful deduction for diminished value must be explained; opening packaging does not automatically cancel your rights.",
  ] },
  { id: "request-a-return", title: "How to request a return", paragraphs: [
    <>Notify <PolicySupportLink /> within 14 days of receiving your piece. Include your order number, the item and a clear statement that you wish to withdraw. A reason is optional for an eligible change-of-mind return.</>,
    "For Turkish consumer withdrawals, send the item back within 14 days of your withdrawal notice. We will provide the return address and carrier instructions. Requesting instructions is not an approval condition for exercising a legal withdrawal right. Keep proof of dispatch and use protective packaging.",
    "The business and return address and nominated carrier are still being arranged. No city map or unconfirmed studio location should be used as a return address.",
  ] },
  { id: "return-postage", title: "Return postage", paragraphs: [
    "For Turkish consumer withdrawals, you are not charged return postage when using the carrier specified in the pre-contract information. If no carrier is specified, you cannot be made responsible for return costs. Other arrangements must comply with the applicable rules.",
    "For other destinations, any lawful customer-paid change-of-mind return cost must be disclosed before purchase. We have not adopted a blanket customer-pays rule. Necessary return costs for faulty or incorrect goods are not treated as an ordinary change-of-mind charge.",
  ] },
  { id: "refunds", title: "Refunds", paragraphs: [
    "Eligible refunds include the payments required by applicable law and use the original payment method without a refund handling fee. Turkish withdrawal refunds are due within 14 days from handover to the nominated return carrier; for a different carrier, from receipt. For undelivered goods, the period starts with the withdrawal notice.",
    "Any stronger destination-specific rights still apply. Bank posting time is separate from the date we issue a refund. We will not replace a statutory refund with store credit unless you freely choose that option.",
  ] },
  { id: "personalised-work", title: "Genuinely personalised work", paragraphs: [
    "An item genuinely made to an individual's specifications, such as unique engraving or a bespoke design, may be excluded from change-of-mind withdrawal where the law permits. Any applicable exception must be identified before payment.",
    "We do not currently list a blanket bespoke exclusion: the actual personalisation services still need to be confirmed. Choosing from ordinary preset sizes or materials, or starting production after payment, is not enough on its own to label every order bespoke.",
  ] },
  { id: "faults-and-cancellations", title: "Faults, cancellations & your rights", paragraphs: [
    <>If your piece is faulty, damaged, incorrect or not as described, email <PolicySupportLink /> with the order details. Photos can help us investigate, but a short photo-reporting deadline will not remove statutory rights. Depending on the circumstances, remedies may include repair, replacement, a price reduction or a refund.</>,
    "Contact us promptly to cancel before dispatch. Starting production or taking full payment does not automatically remove the withdrawal rights that apply to a standard product. Genuine bespoke work requires separate, lawful terms agreed in advance.",
  ] },
];

export default function ReturnsPage() {
  return <PolicyPage currentPath="/returns" title="Returns & Refunds" introduction="Handmade should feel personal, not uncertain. Clear distinctions between standard pieces, individual commissions and your consumer rights." sections={sections} />;
}
