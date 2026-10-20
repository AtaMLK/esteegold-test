# Languages and appearance

Updated 21 October 2026. Verification notes describe local checks; production deployment status must be verified separately.

## Language URLs

- English keeps its existing URLs, including `/`, `/bags`, `/silver`, `/categories` and `/product/:id`.
- Turkish uses `/tr`, `/tr/bags`, `/tr/silver`, `/tr/categories` and `/tr/product/:id`.
- About, contact, size/material guidance, four policy drafts, cart, checkout/result, saved pieces, account, sign-in and password recovery also have Turkish versions.
- The language control preserves the corresponding page, query filters and fragment. There is no IP-based language redirect and no language-tracking cookie. Language and regional pricing are independent: choosing Turkish does not change the delivery country or force a currency.
- Shared public navigation stays in the selected language. Guest saving redirects to the localized sign-in screen with a return destination. Sign-out returns to the selected language's home page.
- Admin remains English and shares the storefront's saved light/dark theme, with its own sun/moon control above the dashboard pages. Unsupported/legacy routes do not receive invented Turkish aliases; `/tr/admin` is not an admin bypass.

Translations render through React on the server, not by replacing DOM text after load. The URL supplies the document language. Middleware overwrites its internal language header instead of trusting a caller-provided header.

## Content maintenance

Journey/gallery copy lives in `app/_components/ui/house-content-tr.js`; interface labels live in `app/_lib/ui-translations.js`; draft policies live in `app/_lib/policies-tr.js`. Update both languages when changing policy terms. Translated policies retain their pre-launch warnings and remain noindex; translating them is not legal approval.

Product names remain the owner's existing product names. Current catalog descriptions have Turkish editorial equivalents in `app/_lib/localization.js`. An unknown/new product receives a factual Turkish introduction, not a fabricated translation of an unreviewed English description. Admin/CMS fields for independently editing both languages are not added in this release; new product descriptions and category translations need explicit editorial maintenance. The `description_tr`/`story_tr` fallbacks in the helper are forward-compatible only, not a claim that those database columns exist.

Selectable material, size, stone and country labels may be translated, but their submitted values retain the canonical identifiers expected by the server. Do not translate those identifiers in payment requests or database records.

Supabase email templates and iyzico-hosted screens are separate services. Their language settings and payment-return language need checking during merchant/domain launch configuration; no live payment or recovery email is sent by these checks.

## Appearance

The header exposes the English/Turkish control and a sage-toned sun/moon button that switches between light and dark only; mobile uses a compact icon button in the header. The menu contains neither switch and inherits the selected language and theme, including the menu visual's surrounding surface. Its full-viewport layout keeps navigation and footer links inside the viewport without scrolling, with compact spacing for short landscape screens. At the narrowest mobile widths, account access stays available in the menu rather than crowding the header. The theme choice is saved under `esteehouse-theme` in localStorage. New visitors and older saved system preferences default to light; operating-system changes do not override the choice. A small head script applies the preference before paint. No image inversion filter is used; product photography retains its original colours. The existing gallery desaturation is part of its neighbouring-card treatment, not a theme transformation.

Dark styling covers public chrome, editorial journeys/gallery, buying pages, policy drafts, dialogs and account forms. Error text and saved-piece controls have dark-surface colours. Reduced-motion behaviour remains independent of theme and language. Preference storage is disclosed in both privacy drafts; no advertising or analytics integration is added.

Admin uses the same `esteehouse-theme` preference and reusable sun/moon control, in a toolbar shared by all five back-office pages. Switching there also updates the storefront preference. Admin text, table surfaces, borders, form fields, native options, selected choices, errors and editor panels have dark treatments; the previous forced-light admin override is removed. This changes appearance only, not authentication, permissions or commerce behaviour.

Account opening uses bounded session and role requests rather than an indefinite redirect screen. A failed check exposes retry/sign-out controls. Login submits credentials once; the auth-state effect owns the account redirect, avoiding duplicate role checks and competing navigation. Cached session user data supplies display state only: admin and order APIs still verify the access token on the server. Account labels, redirect/error text, social controls and password-recovery screens have explicit dark-surface colours.

Sign-in and registration now use shared local colour tokens: the form card is transparent over a single panel surface, including browser-autofilled inputs. The shell fits the dynamic viewport. Forms remain vertically scrollable inside their panel only when available height cannot accommodate accessible controls; the page never needs horizontal scrolling. On wide screens a softly flexing editorial curtain exchanges sides with understated text parallax. On mobile it sweeps across and exits the viewport completely. Reduced motion switches immediately; inactive forms are inert and focus moves to the newly revealed heading. Scoped GSAP cleanup and responsive resets prevent stranded animations after navigation or resizing.

The admin catalog uses explicit column proportions and an 880px minimum table width rather than an unconditional 1050px minimum. It fits normal desktop content areas without a horizontal scrollbar; narrower content areas retain local table scrolling without widening the page.

Sign-in, registration and the account-opening screen have a localized home link independent of browser history. The menu's account/saved links sit below its left navigation column, allowing the right visual to extend to the bottom of the usable viewport. The menu's Istanbul/date label is removed. The photo arch and its larger echo share a fixed 3:4 portrait ratio and scale together within the available width and height, with separate space reserved for the index and caption. Photos retain aspect-preserving cover sizing. Menu images are loaded when the menu opens and crossfade; the previous photo remains visible until the newly requested photo loads.

## Search launch

The owner confirmed `https://theesteehouse.com` as the intended canonical origin. Public translated pages have self-canonicals and reciprocal English/Turkish/x-default alternates. Both language versions of indexable editorial/catalog/product pages appear in the sitemap. Private routes and draft policies remain noindex and outside the sitemap.

The confirmed name is not proof of DNS ownership, HTTPS connection, deployment or indexing. Keep `SEO_INDEXING_ENABLED` unset/false until production domain configuration and merchant/legal/content readiness are verified. Set the real `NEXT_PUBLIC_SITE_URL` in Vercel Production during launch. Do not turn a preview deployment indexable. See `SEO_GEO_LAUNCH.md` for the remaining launch steps; neither SEO nor GEO implementation guarantees a first-place ranking.

## Verification

Latest local run: 22 browser/SSR checks passed; 47 JavaScript/JSX files passed targeted ESLint. Evidence is held in the working-session `outputs/appearance-checks.json` and screenshots, outside the application repository.

The separate account regression check uses mocked auth, role and order endpoints in an isolated browser. It verifies a stalled role request reaches a visible timeout, retry reaches the member profile, login does not issue competing role checks, and account labels/loading text change colour with the theme. It also lints the new request helper and four related modules. This is not a live administrator sign-in or a test of real account credentials.

Admin appearance checks exercise the real shared theme control against a representative back-office style fixture, including dark/light panel colours, table text, native inputs/options, selected choices, errors, keyboard operation, persistence and mobile width. The shared control and admin layout pass targeted ESLint. Live authenticated admin-page testing remains separate; middleware authentication is not disabled or bypassed for appearance tests.

The authentication layout regression covers 32 Turkish light/dark, sign-in/registration and viewport combinations across eight sizes, plus English direct registration. It checks a 4.5:1 minimum contrast for secondary text, a uniform form surface, full viewport height, absence of page horizontal overflow, fitting forms at normal heights, inert inactive forms, both curtain directions, focus, resize and reduced motion. A catalog-style fixture checks desktop fit and retained narrow-screen table scrolling. The account timeout/retry regression also passes with the new colours. No real credentials, registration, orders or stock changes are used.

Menu resize checks verify that the artwork, photo and echo retain their 3:4 proportions from 715px to 1920px, growing in both dimensions or stopping at the available height limit. Caption clearance is checked for all five items in English and Turkish, including short landscape screens. Full-menu viewport fit, all five image loads and localized home links also pass.

Local browser checks cover server-rendered languages/canonicals/alternates, bilingual sitemap, no admin alias, draft-policy warnings/noindex, language switching with filters, saved theme, original image colours, localized product selections, guest wishlist/sign-in routing, cart/checkout canonical values, Turkish search/reload, mobile header controls and full-viewport menus at 320×568, 390×844, 844×390, 1280×600 and 1280×900. Checks use isolated browser profiles and do not submit payments, send recovery emails, alter live products or change order/stock records. Targeted ESLint checks include the changed modules. A production build, domain activation, search-engine submission and deployment are separate steps.
