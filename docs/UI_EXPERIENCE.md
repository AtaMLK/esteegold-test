# EsteeHouse motion experience

The house homepage and the Bags and Silver collection homepages combine a pinned editorial journey with a draggable radial gallery. Both use the existing GSAP dependency and original project photography; the storefront, account and payment routes remain connected through shared navigation.

## Scroll journey

`app/_components/ui/house-content.js` defines the three editorial stories, their image selections and collection links. `scroll-journey.jsx` renders eight chapters along a custom cubic Bézier camera path. Chapter positions use viewport-relative coordinates, and the camera follows the inverse path so native vertical scrolling reveals the composition downward, diagonally, horizontally, upward, through two curves, then downward again.

ScrollTrigger pins the stage and scrubs the camera in both directions. Images and copy have separate restrained parallax offsets. Only the current chapter is keyboard-accessible; the header, skip link and collection links remain available. Resize refreshes rebuild the path using current stage dimensions.

With reduced motion, or a viewport shorter than 620px, the content becomes ordinary stacked editorial sections without pinning or scrub. This also avoids trapping content behind the controls in mobile landscape. No JavaScript is required to read the static chapter layout.

## Radial gallery

`app/_components/ui/radial-gallery.jsx` positions cards using sine/cosine around an invisible circle. Position, rotation, prominence and grayscale all derive from one continuous wheel position. The centred card is upright and in full color.

Native Pointer Events distinguish horizontal drags from vertical scrolling. The stage captures the pointer only after horizontal intent is clear; `touch-action: pan-y pinch-zoom` preserves native vertical touch scrolling and zoom. GSAP animates release momentum and snapping. Recent pointer samples project a bounded release velocity into a softly eased integer-card snap. Previous/next buttons and Left/Right/Home/End keys use the same controller. Reduced motion makes selection immediate and removes release momentum.

The gallery is an editorial selection, not a live product/price feed. Its links lead to the existing collection filters; there are no invented product purchase links.

## Shared navigation

`header.jsx` uses native modal dialogs for navigation and search, including browser focus containment, Escape dismissal and return focus. Search supports Ctrl/Command+K. The mobile account action stays visible. `site-chrome.jsx` provides a skip-to-content link without nesting main landmarks.

Visual rules are scoped in `house-experience.css`, `house-chrome.css` and `house-pages.css`. About and Contact share the editorial image shapes, type and palette. Commerce and customer-care pages keep their existing flows while sharing typography, focus styling and olive accents. Catalog filters sit below the fixed header, rather than underneath it. The body clips horizontal overflow without becoming an unintended scrolling ancestor that breaks sticky positioning.

The menu responds to both hover and keyboard focus. Each entry has its own image, caption and surrounding tone. A larger, translucent copy of the same arch sits behind the main image. Images crossfade without replacing the dialog or losing keyboard focus. Background chapter lettering, chapter numbers and gallery lettering are half their previous desktop and mobile sizes; foreground headings and useful counters remain readable.

## Collection routes and search visibility

- `/` is the house overview; `/bags` and `/silver` are separate collection homepages with distinct server-rendered stories, titles, descriptions and canonical URLs.
- The pill-shaped collection switcher uses real links, so refreshing, sharing, browser Back and crawlers do not depend on a hidden content toggle. It changes the selected story, images and gallery through normal Next.js navigation.
- `/gold` and `/silvers` permanently redirect to `/silver`. There are only two public collections: Bags and Silver.
- The obsolete `/product` demo index redirects to `/categories`, removing its old page-wide overflow rule and placeholder product links. Individual `/product/[productsId]` routes remain intact.
- The public Silver collection maps to the existing internal `EsteeGold` catalog key. This is a presentation compatibility layer, not a database migration. Old `?branch=gold` links still select Silver. Product material options and prices are not rewritten.
- `app/sitemap.js` lists the house, collection and editorial routes. Set `NEXT_PUBLIC_SITE_URL` to the final production origin before launch; the current fallback is the existing Vercel test domain.
- These changes make the collection content easier to reach and distinguish; they do not guarantee search rankings or AI-search inclusion. The live catalog and product routes still use the existing client-loaded data flow.

## Replacing the photography

All current editorial images come from the existing local archive and are temporary selections pending the owner's original collection photography. Some archive images show mixed metal tones: do not treat them as material certification or a verified live-product feed. Replace the paths and alt descriptions in `house-content.js`, the navigation records in `header.jsx`, and the editorial images in About and Contact. Product images remain controlled by the existing catalog.

## Branch safety

The redesign lives on `feat/cinematic-scroll-gallery`. The original design stays on `main` at `9b3186cac4764d31ca3a4a384d4f61447e5efddc`; existing branches are preserved. Commit `d6150d4` is the first saved redesign checkpoint and was pushed to GitHub before this collection revision began.

## Local workflow

Use `npm ci` after syncing the repository. Run `npm run dev` for a local preview and `npm run build` for production compilation. Required environment variable names are documented in the root README; do not commit environment files.

Check desktop and mobile layouts, scroll reversal, chapter transitions, gallery drag/release, touch scrolling, keyboard navigation, search, modal focus, route transitions, resize and live reduced-motion changes. Verify image loading and ensure all collection/account/bag links remain usable.

This UI revision does not resolve the separate payment, refund, pricing, inventory and policy-content findings from the earlier source audit.

## Verification on 17 October 2026

- Synced the clean local checkout to origin/main at 9b3186cac4764d31ca3a4a384d4f61447e5efddc before editing.
- Installed the committed dependency lockfile with npm ci. The lockfile and package manifest are unchanged by this revision.
- All five modified/new JSX components pass the project's ESLint rules when JSX is included explicitly in the flat-config file selection.
- Browser checks pass for initialization without runtime errors; camera-path movement and exact reversal; search focus, Ctrl+K and Escape; modal focus containment; gallery buttons, keyboard and wrapping; drag and snap; live reduced-motion changes; route cleanup; mobile account visibility and overflow; touch dragging; and static short-landscape layout.
- Inspected desktop home/gallery and mobile screenshots. The camera uses one pinned stage across eight chapters, and the gallery has independent native vertical scrolling.
- Production assets compile successfully. The complete production build remains blocked by pre-existing lint parser serialization and missing Supabase server credentials during API page-data collection. No secrets were fabricated and no backend settings were changed.
- The initial revision was subsequently saved as `d6150d4` on `feat/cinematic-scroll-gallery` and pushed to GitHub. Pushing a feature branch does not replace `main` or independently verify a Vercel deployment.

## Collection revision — 18 October 2026

- Bags and Silver now have separate cinematic homepages, matching galleries, crawlable collection switchers and unique page metadata. The old Gold address redirects to Silver.
- Desktop and mobile reviews cover the house, both collections, About, Contact, catalog, cart, saved pieces, checkout, customer-care pages and authentication entry pages. No payment is submitted during these checks.
- Fixed the inherited body overflow rule that prevented the catalog toolbar from sticking below the header. Catalog Back navigation and legacy collection query strings retain the correct selected filter.
- Replaced intermittent plugin-based touch handling with native horizontal-intent detection and pointer capture. Touch dragging is rechecked after navigating through the other public routes; short landscape and reduced-motion layouts remain readable without pinning.
- The redesigned source passes the existing lint rules, with JSX included explicitly in the check. Inspected desktop and mobile screenshots of the collection homepages and shared editorial pages.
- Original collection photography, final policy copy and the existing payment/backend launch requirements remain separate tasks. Archive photography is not a verified product feed.
