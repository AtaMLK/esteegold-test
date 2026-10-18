import { pageMetadata } from "../_lib/seo";
import PolicyPage, { PolicySupportLink } from "../_components/ui/policy-page";

export const metadata = pageMetadata({ title: "Privacy & Browser Storage — EsteeHouse", path: "/privacy", noindex: true });

const sections = [
  { id: "who-is-responsible", title: "Who is responsible", paragraphs: [
    <>EsteeHouse is a brand in preparation in Türkiye. The legal data controller&apos;s identity and business address have not yet been finalised; this draft is not a complete launch notice. Privacy enquiries can be sent to <PolicySupportLink />.</>,
  ] },
  { id: "information-you-provide", title: "Information you provide", paragraphs: [
    "Account features use the email address and authentication details needed to sign you in. Checkout collects your name, email, phone number and delivery address, together with ordered products, selected options and payment/order records.",
    "The contact form prepares a message in your own email application. It does not submit the form to a website inbox endpoint. If you send the email, its contents are then handled by the email services used by you and the recipient. Please do not include card details or identity documents in an enquiry.",
  ] },
  { id: "country-and-security", title: "Country pricing & technical information", paragraphs: [
    "The website can use a country code supplied by its hosting network to choose regional prices. This is an approximate country estimate, not GPS tracking. No device-location permission or additional location cookie is needed for the current pricing implementation.",
    "Hosting and security services receive connection information such as IP addresses and request details. The payment integration also passes buyer IP and necessary customer/order information to iyzico for payment processing. Country pricing does not mean that no service provider receives your IP address.",
  ] },
  { id: "browser-storage", title: "Cookies & browser storage", paragraphs: [
    "Authentication uses Supabase browser-session storage and cookies to support sign-in. The cart is kept in localStorage under esteehouse-cart; saved pieces use an account-specific esteehouse-wishlist: key on this device. Saving a piece requires sign-in; saved lists are not shared between accounts. LocalStorage is browser storage, even though it is not a cookie.",
    "Your colour-theme preference is stored on this device in localStorage under esteehouse-theme. Language is selected by the URL; no language-tracking cookie is added.",
    "You can remove saved cart and wishlist information by clearing site data in your browser. Blocking or clearing authentication storage can sign you out; clearing localStorage removes locally saved selections. This does not delete any order or account records held on the server.",
    "No advertising pixel, analytics script or newsletter subscription flow is configured in the reviewed application code. Production hosting settings and any future integrations still require a launch audit. Optional tracking must not be introduced without the required disclosures, controls and, where necessary, prior consent.",
  ] },
  { id: "service-providers", title: "Services that receive information", paragraphs: [
    "The reviewed application uses Vercel hosting, Supabase for accounts and store records, and an iyzico hosted payment page. Payment card details are entered on that payment page rather than the contact form. A delivery carrier will need the information required to deliver an accepted order; the carrier is not yet selected.",
    "The contact map connects to OpenFreeMap only after you choose to load it. Its service then receives network information, including your IP address. The map shows Istanbul at city level and does not request your device location. An external map link opens another website with its own privacy practices.",
    "Supplier regions, email services, subprocessors and any international data transfers must be verified before launch. The appropriate Turkish and, where applicable, overseas transfer safeguards cannot be replaced by a general statement that browsing means consent.",
  ] },
  { id: "purposes-and-retention", title: "Purposes, legal grounds & retention", paragraphs: [
    "The intended purposes are providing requested account and shopping features, responding to enquiries, preparing and fulfilling orders, processing payments, preventing misuse and keeping legally required records. The final notice must connect each processing activity to its applicable legal ground; it must not describe every activity as based on consent.",
    "Account, order, payment, correspondence and security data need separate retention rules based on the actual services and legal obligations. Those periods and deletion procedures are still being reviewed. We have not invented a blanket retention period or promised automatic deletion that the software does not perform.",
  ] },
  { id: "your-rights", title: "Your privacy rights", paragraphs: [
    <>Contact <PolicySupportLink /> about access to your information, corrections or deletion and other rights available under applicable law, including Turkish data-protection law. Some records may need to be kept to meet legal obligations or resolve a dispute.</>,
    "Where processing relies on optional consent, you must be able to withdraw it. Applicable rights to complain to a data-protection authority remain available. The final controller details, request-handling process and statutory response requirements must be completed before launch.",
  ] },
];

export default function PrivacyPage() {
  return <PolicyPage currentPath="/privacy" title="Privacy & Storage" introduction="What the current website uses, why country pricing does not need your precise location, and what still needs to be completed before launch." sections={sections} />;
}
