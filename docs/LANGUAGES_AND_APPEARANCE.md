# Languages and appearance

Updated 19 October 2026. Changes remain in the local feature checkout; this document does not imply a production deployment.

## Language URLs

- English keeps its existing URLs, including `/`, `/bags`, `/silver`, `/categories` and `/product/:id`.
- Turkish uses `/tr`, `/tr/bags`, `/tr/silver`, `/tr/categories` and `/tr/product/:id`.
- About, contact, size/material guidance, four policy drafts, cart, checkout/result, saved pieces, account, sign-in and password recovery also have Turkish versions.
- The language control preserves the corresponding page, query filters and fragment. There is no IP-based language redirect and no language-tracking cookie. Language and regional pricing are independent: choosing Turkish does not change the delivery country or force a currency.
- Shared public navigation stays in the selected language. Guest saving redirects to the localized sign-in screen with a return destination. Sign-out returns to the selected language's home page.
- Admin remains English with its existing light palette. Unsupported/legacy routes do not receive invented Turkish aliases; `/tr/admin` is not an admin bypass.

Translations render through React on the server, not by replacing DOM text after load. The URL supplies the document language. Middleware overwrites its internal language header instead of trusting a caller-provided header.

## Content maintenance

Journey/gallery copy lives in `app/_components/ui/house-content-tr.js`; interface labels live in `app/_lib/ui-translations.js`; draft policies live in `app/_lib/policies-tr.js`. Update both languages when changing policy terms. Translated policies retain their pre-launch warnings and remain noindex; translating them is not legal approval.

Product names remain the owner's existing product names. Current catalog descriptions have Turkish editorial equivalents in `app/_lib/localization.js`. An unknown/new product receives a factual Turkish introduction, not a fabricated translation of an unreviewed English description. Admin/CMS fields for independently editing both languages are not added in this release; new product descriptions and category translations need explicit editorial maintenance. The `description_tr`/`story_tr` fallbacks in the helper are forward-compatible only, not a claim that those database columns exist.

Selectable material, size, stone and country labels may be translated, but their submitted values retain the canonical identifiers expected by the server. Do not translate those identifiers in payment requests or database records.

Supabase email templates and iyzico-hosted screens are separate services. Their language settings and payment-return language need checking during merchant/domain launch configuration; no live payment or recovery email is sent by these checks.

## Appearance

Desktop header and the mobile navigation expose language and colour-theme controls. A sage-toned sun/moon button switches between light and dark only. The choice is saved under `esteehouse-theme` in localStorage. New visitors and older saved system preferences default to light; operating-system changes do not override the choice. A small head script applies the preference before paint. No image inversion filter is used; product photography retains its original colours. The existing gallery desaturation is part of its neighbouring-card treatment, not a theme transformation.

Dark styling covers public chrome, editorial journeys/gallery, buying pages, policy drafts, dialogs and account forms. Error text and saved-piece controls have dark-surface colours. Reduced-motion behaviour remains independent of theme and language. Preference storage is disclosed in both privacy drafts; no advertising or analytics integration is added.

## Search launch

The owner confirmed `https://theesteehouse.com` as the intended canonical origin. Public translated pages have self-canonicals and reciprocal English/Turkish/x-default alternates. Both language versions of indexable editorial/catalog/product pages appear in the sitemap. Private routes and draft policies remain noindex and outside the sitemap.

The confirmed name is not proof of DNS ownership, HTTPS connection, deployment or indexing. Keep `SEO_INDEXING_ENABLED` unset/false until production domain configuration and merchant/legal/content readiness are verified. Set the real `NEXT_PUBLIC_SITE_URL` in Vercel Production during launch. Do not turn a preview deployment indexable. See `SEO_GEO_LAUNCH.md` for the remaining launch steps; neither SEO nor GEO implementation guarantees a first-place ranking.

## Verification

Latest local run: 19 browser/SSR checks passed; 47 JavaScript/JSX files passed targeted ESLint. Evidence is held in the working-session `outputs/appearance-checks.json` and screenshots, outside the application repository.

Local browser checks cover server-rendered languages/canonicals/alternates, bilingual sitemap, no admin alias, draft-policy warnings/noindex, language switching with filters, saved theme, original image colours, localized product selections, guest wishlist/sign-in routing, cart/checkout canonical values, Turkish search/reload and 320px navigation. Checks use isolated browser profiles and do not submit payments, send recovery emails, alter live products or change order/stock records. Targeted ESLint checks include the changed modules. A production build, domain activation, search-engine submission and deployment are separate steps.
