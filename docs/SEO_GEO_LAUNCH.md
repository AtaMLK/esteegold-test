# EsteeHouse SEO and AI-search launch plan

Updated 18 October 2026. SEO means search-engine optimisation. GEO here means discoverability in generative/AI search; the geographic market and language strategy still need the owner's confirmation. Neither implementation nor a sitemap guarantees indexing, citations or a first-place ranking.

## Current status — prepared, not published

- The local project did not have a configured permanent `NEXT_PUBLIC_SITE_URL`. The existing Vercel address is a test address. No permanent domain was inferred from the support email.
- This revision deliberately keeps development and preview deployments out of indexing. `SEO_INDEXING_ENABLED=true`, a confirmed public origin and a production build are required before the public indexing rules activate. The owner must confirm the canonical domain, target markets and language plan first.
- Code changes are local to the redesign branch; no commit, push, deployment, Search Console verification, sitemap submission or ranking achievement is claimed.
- No database schema, product description, order, inventory quantity, payment, DNS record or business registration was changed by this SEO revision. Review the current seven active catalog entries and confirm which are final products rather than setup/demo content before launch.

## Implemented foundation

1. Product pages render their actual title, description, price display, image, material/size choices and related links on the server. Crawlers and JavaScript-disabled visitors no longer receive only a loading shell. React request-level caching shares product reads between metadata and page rendering; there is no long-lived price cache that could silently make checkout prices stale.
2. The catalog renders active products and current taxonomy into the initial HTML. Its client filters retain URL state, Back/reload behaviour and combined branch/category/search selections without refetching a partial list on each click.
3. The home, bag and silver pages now include a visible, restrained overview of real active products with ordinary links. Archive/gallery photography is not substituted into product structured data when an actual product image is missing.
4. Public pages have canonical URLs, descriptive titles/descriptions and Open Graph/Twitter metadata. Filtered/search catalog URLs consolidate to `/categories` and are noindex rather than creating an unlimited set of thin landing pages. No unsupported language alternates were invented.
5. The sitemap includes every active product, the canonical editorial/collection pages and the size guide. It omits private routes, draft policies, hidden products and legacy redirect routes. Product last-modified values use real database timestamps, not today's date on every request.
6. Structured data describes the website, the EsteeHouse brand organisation, actual product identity and visible breadcrumbs/list contents. JSON-LD is escaped against script-closing input. No fake reviews, aggregate ratings, sales totals, awards, address, LocalBusiness details, company registration, GTIN or stock availability were added.
7. Missing/hidden products use Next.js not-found handling instead of an indexable 200-status loading shell. Database errors are not deliberately converted into fake missing products. The decorative home overview can fall back to its editorial copy if product preview data is unavailable; sitemap and product data failures should remain visible operational errors rather than fabricated successful empty catalogs.
8. Private/API pages carry noindex controls; account/admin routes retain their existing authentication checks. Robots directives are crawl instructions, not access control or a guarantee that an already-known URL disappears immediately.
9. A visible, linked size/material guide explains the EU ring system, centimetre lengths, one-size earrings and gold plating. It is useful buying information rather than hidden AI-targeted text or a promise that every preset is available on every piece.
10. Verification meta tags are supported through `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION`. No verification token was fabricated and no tracking/advertising script was introduced.

## Important product-markup limitation

Product entities currently omit `Offer`, `Review` and `AggregateRating`. The live-selling setup is not complete: seller identity, shipping calculations, final policies, real stock/production availability and payment readiness still need confirmation. The current markup is therefore not a claim of Google merchant-listing or product-rich-result eligibility. Google's product enhancements require additional qualifying information; adding a bare Product object does not guarantee a rich result.

After commercial readiness is verified, add accurate offers and availability that match visible regional prices and actual purchasable options. Do not mark all pieces InStock or invent a made-to-order availability date. Gold-plated variants require their configured per-product price. ProductGroup/variant markup should wait until each advertised variant has a reliable selectable URL and matching size/material/price/availability behaviour. Do not invent shipping/refund schema from draft policies.

## Production activation checklist

1. The owner confirmed `theesteehouse.com` and English + Turkish content. Public language URLs are implemented; see `LANGUAGES_AND_APPEARANCE.md`. Still verify control of the domain and connect it to the correct Vercel project with HTTPS. Target-market priorities remain to be confirmed.
2. Finish legal seller/contact details, final delivery/return terms, real product photos/copy, merchant approval, server-calculated international shipping and the stock/made-to-order workflow. A search launch should not advertise demo products or imply a checkout that cannot fulfil an order correctly.
3. Set the following in **Vercel Production**, replacing placeholders with real values. Keep indexing disabled for previews and test deployments:

   ```text
   NEXT_PUBLIC_SITE_URL=https://theesteehouse.com
   SEO_INDEXING_ENABLED=true
   GOOGLE_SITE_VERIFICATION=YOUR-GOOGLE-META-VERIFICATION-TOKEN
   BING_SITE_VERIFICATION=YOUR-BING-META-VERIFICATION-TOKEN
   ```

   The verification values are optional until supplied. DNS-based Search Console verification does not require a meta token. Changing build-time environment variables requires rebuilding/redeploying. Keep the site origin consistent with checkout callback configuration.
4. Configure the preferred www/non-www domain and approved production/test-domain redirects in hosting. Do not redirect localhost or every preview host to the public shop. Use deployment protection for private previews; robots/noindex are not privacy controls.
5. Deploy, then inspect `/robots.txt`, `/sitemap.xml`, page canonicals, HTTP status codes and response headers on the real domain. Public production pages must not retain noindex; account, API and draft-policy pages must stay excluded as appropriate.
6. Verify the domain in Google Search Console and Bing Webmaster Tools. Submit the real `/sitemap.xml`, inspect representative product/collection URLs and request indexing where appropriate. Use Google's Rich Results Test to review implemented entities and outstanding merchant requirements. No submission was performed from this session.
7. Once the shop and offers are eligible, consider Merchant Center free listings with a matching product feed. IndexNow can be considered for supported engines after domain ownership and a compliant submission process are configured; it is not a Google first-place mechanism.
8. Measure mobile Core Web Vitals, crawl/indexing issues and real search queries after deployment. Local `next dev` compilation timings are not production performance measurements.

## Content work that matters next

- Give each product a useful, unique description: actual material/base metal, finish, dimensions, construction, closure, weight where measured, who made it, what is included and genuine production/delivery information. Do not invent these details to fill a keyword template.
- Current descriptions are short and some are generic. The Blue Sea bag description also contains spelling errors. Confirm final maker-authored copy and real photos before indexing; no product records were overwritten in this revision.
- Start with brand and relevant long-tail topics such as handmade paracord bags, 925 silver rings with EU sizing and handmade silver earrings. These are themes based on the catalog, not researched search-volume estimates or guaranteed ranking opportunities.
- Add distinct category landing pages only when there are real products and useful category-specific content. Do not mass-generate city/keyword/filter pages or fabricated customer questions just to occupy search results.
- English is the current rendered language. If Turkish is required, publish genuinely translated, complete Turkish pages with their own URLs and correct reciprocal hreflang/canonicals. Merely adding `tr` tags to English pages is not multilingual SEO.
- Build trust through real maker information, original photography, consistent public contact details, genuine customer reviews and legitimate mentions. Do not buy spam links or manufacture reviews, affiliations, awards or AI citations.

## GEO: what is and is not being promised

Google says its AI search features use the same core crawlability, indexing and helpful-content foundations as ordinary search, and do not require special AI text files or special schema. This revision therefore prioritises server-visible information, clear entities, internal links and readable buying guidance. No `llms.txt` ranking promise, hidden prompt injection or AI-only duplicate content was added.

When production indexing is explicitly enabled, the general public crawl rules also allow search crawlers such as OAI-SearchBot while keeping private/API routes excluded. Search crawling and model-training controls are different concerns; no new bespoke training-crawler policy was silently selected. Hosting/CDN bot protection must also permit legitimate crawlers if the owner wants discovery. Crawling permission does not guarantee a ChatGPT, Google AI or Copilot citation.

## Primary references

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: product structured data](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Google: product variants](https://developers.google.com/search/docs/appearance/structured-data/product-variants)
- [Google: ecommerce URL structure](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites)
- [Google: robots.txt limitations](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Bing: Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a)
- [OpenAI: crawler controls](https://developers.openai.com/api/docs/bots)

## Local validation

`work/ui-qa/check-seo.cjs` checks raw/crawler-visible HTML with JavaScript disabled, canonical/meta/schema output, sitemap coverage, noindex controls, actual missing-product status and interactive cart/filter regressions. `work/ui-qa/lint-seo.cjs` covers the changed source. Reports are written to `outputs/seo-checks.json` in the Codex workspace, not to a public website route. Local checks are not a live Google index or Search Console verification.
