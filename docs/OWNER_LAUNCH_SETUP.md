# EsteeHouse: owner decisions and launch checklist

Updated 18 October 2026. This is implementation planning, not a legal or tax opinion. The four policy routes are owner-review drafts with noindex metadata; they are not a completed legal launch package. Local changes have not been deployed by this revision.

## Confirmed by the owner

- Operating country: Türkiye. There is no registered company yet; legal seller identity, lawful trading/tax route, business address and returns address are unconfirmed.
- Support email: support@theesteehouse.com. This revision changes website links, not mailbox provisioning, DNS, delivery or verification.
- Map: city only; retain Istanbul, with no home/studio marker or device geolocation.
- Products: handmade bags and silver pieces, some in stock and some produced after ordering.
- Ready pieces: owner requested dispatch within one day. The draft expresses this as one business day, not one-day delivery. Confirm this business-day interpretation and pickup arrangements before launch.
- Made-to-order production: **10–14 business days including production and carrier transit**, corrected by the owner after the earlier production-only interpretation. Confirm destination/service feasibility before accepting the order.
- Payment preference: **100% prepaid**, not a deposit. This is not a no-refund condition.
- Standard domestic shipping: free within Türkiye.
- International intention: supported, non-restricted destinations across Europe, Asia, the Americas and Africa. Do not promise every country or postcode.
- Packed silver-piece weight: approximately 100–150 g maximum. Bags: approximately 400 g–2 kg. Box dimensions and dispatch postcode are not supplied.

## Recommended commercial rules — require owner sign-off

1. Adopt a 14-day withdrawal notice window for eligible standard products, including standard designs produced after ordering. Preserve stronger mandatory rights; never use a blanket handmade/final-sale exclusion. Genuinely bespoke exceptions require actual individual specifications and pre-contract disclosure. No specific bespoke service has yet been confirmed.
2. Use the lawful nominated-carrier arrangement for Turkish returns; do not assume every customer pays return postage. Treat faults, damage, wrong goods and nonconformity separately from change of mind.
3. Ship mixed ready/made-to-order baskets together when complete by default. Quote split shipping before payment if requested. This is a recommendation, not an existing automated fulfilment feature.
4. Start without marketing analytics, ad pixels or newsletter collection. Analytics measure visits and usage; advertising pixels connect site actions with ad platforms; newsletters are promotional emails. None is required to run country pricing or accept a purchase. Production dashboard integrations still need auditing.
5. Use tracked, destination-specific shipping at launch; do not subsidise every international parcel until actual margins are known. Confirm whether import charges are prepaid or payable on arrival and disclose the arrangement before payment.

## Shipping-price research: prices advertised by sellers, not carrier quotes

Checked 18 October 2026. Retail delivery offers can be subsidised by a seller's product margins and are not the seller's actual shipping costs.

| Reference | Advertised approach | What to take from it |
| --- | --- | --- |
| [Daga Jewels](https://dagajewels.com/policies/shipping-policy) | Complimentary DHL Express shipping; made-to-order production separated from delivery | A premium seller can build delivery into margins. This does not show that your 2 kg bag ships for free. |
| [ANNAH HARIRI](https://www.annahariri.com/pages/shipping) | Standard post advertised at USD 9 per piece; express priced separately | Economy and express can be separate choices. USD 9 is this seller's retail offer, not an EsteeHouse rate. |
| [H'Istanbul Silver](https://histanbul.com/policies/shipping-policy) | International destination-based checkout rates | This is a safer pattern than a single worldwide price when parcel sizes differ. |
| [Harkness](https://harknessjewellery.com/pages/faqs) | Full payment for made-to-order pieces, with making time stated separately | Supports the chosen prepaid model, not adoption of its return exclusions or delivery disclaimers. |

### Practical rate setup

- Measure **outer packed length × width × height in cm**, actual gross weight, declared value and material content for each representative parcel. Get the dispatch city/postcode and sample destination postcodes. Never assume every silver parcel is charged at 150 g.
- [DHL's own guidance](https://www.dhl.com/discover/tr-tr/ship-with-dhl/export-with-dhl/courier-pickup) uses the greater of actual weight and volumetric kg, calculated as centimetres L × W × H / 5000; other services can have different divisors, minimums and rounding.
- Illustrations, **not the owner's actual packages or rate quotes**: a 20 × 15 × 8 cm box has 0.48 kg volumetric weight; a 35 × 30 × 15 cm bag box has 3.15 kg volumetric weight even if the actual parcel is 2 kg.
- Request written quotes from suitable tracked economy and express services for the exact products and values. Confirm explicitly that silver jewellery and any stones are accepted and what loss/damage cover, exclusions and value limits apply. Do not assume generic parcel insurance covers jewellery.
- Compare Türkiye, EU, UK, US/Canada and remaining supported destinations. Separate silver/small parcels from bags and use actual carrier chargeable-weight bands. Asia and Africa are not single uniform price zones.
- Include base carriage, fuel/remote-area surcharges, packaging and applicable carrier taxes; choose explicitly how much the business subsidises. Do not include undisclosed recipient import taxes in a vague shipping fee.
- Initially show a verified quote before payment. After several real quotes, configure a versioned server-side zone/weight table, basket aggregation and delivery-address validation. Fail closed for unsupported or unpriced destinations. Never trust a shipping amount supplied by the browser.
- Do not introduce a free-international-shipping threshold until contribution margin covers the eligible parcels. No international prices or carriers have been invented or activated by this revision.

## Legal identity and payment approval — before live sales

- Confirm the appropriate lawful route with a Turkish accountant: a registered business/sole trader, or an applicable home-production exemption if genuinely eligible. The [GİB home-production guide](https://cdn.gib.gov.tr/api/gibportal-file/file/getFileResources?objectKey=arsiv/onceki-dokumanlar/2025_esnaf_muafligi.pdf) describes conditional routes; it does not establish eligibility for this owner's bag and silver activity or provide current-year limits. Do not assume the same exemption covers every product or production method.
- A home or virtual-office address must be genuinely usable and accepted for the applicable seller registration, notices and returns arrangements. An invented or merely borrowed address is not an alternative to lawful seller setup. Confirm suitability with the accountant, provider and payment processor before publishing a residential address.
- [iyzico's help centre](https://www.iyzico.com/destek/yardim-merkezi?v=1.0.26) distinguishes individual payment links from its company-required Virtual POS/marketplace products. The repository's checkoutFormInitialize integration is not automatically converted into an individual payment-link account. Confirm the exact approved product before taking live payments; link eligibility does not waive tax or consumer duties.
- Add the actual seller identity, legally required contact/registration details, business and return address, pre-contract information and distance-sales agreement. Retain an order-specific copy/version; a checkbox linking to editable pages alone is not a complete contract-evidence workflow.
- Obtain jurisdiction-specific review for Turkish consumers and the actual overseas markets. Prepare accurate Turkish-language information for the domestic market. Check destination product, tax, customs and consumer-interface obligations before enabling each market.

## Technical launch blockers found, not silently changed

1. `app/api/payment/initialize/route.js` currently inserts `shipping_total: 0` and uses a goods-only payment total. The cart says shipping is calculated next, but there is no verified international shipping calculator. Do not enable worldwide live checkout until this is fixed and tested. International shipping totals remain a separate launch blocker.
2. The selected full-prepayment model still needs explicit per-product ready-to-ship/made-to-order availability and production lead times in admin, catalog, cart and immutable order snapshots. Production capacity must not be represented as fake physical stock. Keep existing stock controls until the full flow is designed and safely tested.
3. The legal seller/data-controller details are absent. Email and a city map do not replace these disclosures. Privacy purpose/legal-ground mapping, retention, actual supplier regions and cross-border safeguards remain to be verified. Do not claim a draft alone makes the site KVKK/GDPR compliant.
4. Production analytics and email providers are not known. No new trackers/newsletter form were added. The old automatic recently-viewed localStorage write was unused elsewhere and has been removed to avoid unnecessary persistent browsing history; existing visitors' old storage is not remotely erased. Cart/wishlist/session storage remains disclosed.
5. Region correction controls, EU-applicable online withdrawal interface, final return-carrier operations and durable customer notices remain launch-review work. No real orders, payments, refunds, inventory or database records were changed in this revision.

## Primary legal references

- [Türkiye Ministry of Trade: distance contracts, August 2026](https://tuketici.ticaret.gov.tr/yayinlar/tuketici-bilgi-rehberi/mesafeli-sozlesmeler-hakkinda-bilgilendirme): withdrawal, delivery responsibility and return arrangements.
- [European Commission guidance, section 5.11.2](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021XC1229(04)): standard choices versus genuinely individual specifications.
- [KVKK: disclosure duty](https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-): controller identity, purposes, recipients, collection/legal grounds and rights.
- [KVKK cookie guide](https://www.kvkk.gov.tr/Icerik/7353/Cerez-Uygulamalari-Hakkinda-Rehber): assess actual storage and applicable consent conditions; do not add an accept-all-only banner as a substitute for controls.

## Remaining owner information

- Legal seller/controller name, approved lawful status, public service/returns address, legally required contact details, and confirmation that the support mailbox works. Do not send identity documents through chat.
- Outer package dimensions, dispatch city/postcode, item values and representative destination postcodes for real shipping quotes.
- Chosen carrier(s), permitted silver/stone carriage and insurance, return-carrier arrangement, customs-charge model and reachable destinations.
- Confirmation of the proposed standard return policy, mixed-order shipping approach and one-business-day ready-stock dispatch target.

## Subsequent catalog revision

The owner requested 10–14 business days **including** carrier transit, EsteeHouse-only shipping branding, login-required saved pieces, dynamic catalog taxonomy, confirmations, admin thumbnails, an inset modal scrollbar, video controls and high-quality WebP delivery. The catalog migration preserves existing branches/categories and adds safe archival. Standard-size defaults were explicitly requested by the owner: EU ring circumference 48–62 in 2 mm steps; bracelet lengths 16–22 cm; necklace lengths 40/45/50/55/60/75 cm; earrings One size. See the [Pandora ring chart](https://uk.pandora.net/en/size-guide/guide-size-rings.html) and [Tiffany necklace guide](https://www.tiffany.com/client-services/size-guide/necklaces-pendants-size.html) for measurement-system context, not a claim that every maker has identical sizes. Admins can adjust the offered defaults. A set containing multiple sized pieces needs actual product-specific choices; none are invented. Gold plating is not solid gold; a configured plated price is required before that option can be purchased. Existing order, inventory and payment histories are retained.
