# EsteeHouse motion experience

The homepage combines a pinned editorial journey with a draggable radial gallery. Both use the existing GSAP dependency and original project photography; the storefront, account and payment routes remain connected through shared navigation.

## Scroll journey

`app/_components/ui/scroll-journey.jsx` defines eight chapters and a custom cubic Bézier camera path. Chapter positions use viewport-relative coordinates, and the camera follows the inverse path so native vertical scrolling reveals the composition downward, diagonally, horizontally, upward, through two curves, then downward again.

ScrollTrigger pins the stage and scrubs the camera in both directions. Images and copy have separate restrained parallax offsets. Only the current chapter is keyboard-accessible; the header, skip link and collection links remain available. Resize refreshes rebuild the path using current stage dimensions.

With reduced motion, or a viewport shorter than 620px, the content becomes ordinary stacked editorial sections without pinning or scrub. This also avoids trapping content behind the controls in mobile landscape. No JavaScript is required to read the static chapter layout.

## Radial gallery

`app/_components/ui/radial-gallery.jsx` positions cards using sine/cosine around an invisible circle. Position, rotation, prominence and grayscale all derive from one continuous wheel position. The centred card is upright and in full color.

GSAP Draggable controls a proxy so horizontal gestures rotate the wheel while native vertical touch scrolling remains available. Recent pointer samples project a bounded release velocity into a softly eased integer-card snap. Previous/next buttons and Left/Right/Home/End keys use the same controller. Reduced motion makes selection immediate and removes release momentum.

The gallery is an editorial selection, not a live product/price feed. Its links lead to the existing collection filters; there are no invented product purchase links.

## Shared navigation

`header.jsx` uses native modal dialogs for navigation and search, including browser focus containment, Escape dismissal and return focus. Search supports Ctrl/Command+K. The mobile account action stays visible. `site-chrome.jsx` provides a skip-to-content link without nesting main landmarks.

Visual rules are scoped in `house-experience.css` and `house-chrome.css`. The existing footer and commerce pages retain their original content and share the paper/olive palette.

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
- The local UI revision is uncommitted and has not been pushed or deployed.
