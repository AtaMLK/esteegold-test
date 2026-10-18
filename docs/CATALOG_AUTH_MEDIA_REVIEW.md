# Catalog, authentication and media revision

18 October 2026. Source changes remain on `feat/cinematic-scroll-gallery`; this revision does not commit, push or deploy them. The additive database migrations below have been applied to the connected EsteeGoldStudio Supabase project. The old design branch is not merged or deleted.

## What changed

- Customer and admin sign-out share one checked operation, disable repeated clicks, clear the current session and navigate to the homepage. The customer profile no longer remains open as “Member”. Initial authentication requests cannot overwrite a newer authentication event.
- Saving a product requires sign-in. Saved lists are scoped to the signed-in account on the current device, not shared with guests or another account. They are not advertised as cloud-synchronised. In-flight saved-product requests are aborted when the saved selection changes.
- Branch, category and search filters compose consistently and persist in the catalog URL. Reload, Back and query-only navigation restore the selection. Category choices come from the managed catalog taxonomy rather than the currently filtered result subset. Changing a filter does not fetch another partial catalog.
- The database currently has eight non-archived products, seven of which are active. The hidden bag remains hidden. Product counts can legitimately change with filters or visibility; no hidden item was activated to inflate a count.
- Administrators can create branches with a bag, silver or other-artwork product type, and categories belonging to those branches. Product categories are selects, not free text. Custom branches work in public filtering, product option validation and new order snapshots.
- Removing a product archives it from the catalog, leaving orders, inventory, media and historical snapshots intact. Removing a non-empty category or branch is refused until products are reassigned or archived, including hidden products. Deleting a branch archives its empty category choices atomically. Database locks and validation triggers protect these rules against concurrent product/category changes.
- A shared native confirmation dialog provides safe initial focus, Escape/cancel behaviour, a blurred backdrop and explicit destructive actions. Product, media, category, branch and saved-list removal use it. Product/cart/saved-list/taxonomy actions also use the shared shadcn-style toast system; notifications no longer sit over the editor heading on mobile.
- Catalog table rows show main-image thumbnails. The product editor has a fixed rounded outer shell, a thin scrollbar inset in its inner body, and a visible save footer. The inventory adjustment editor uses an inset scroll body as well.

## Silver options and prices

The owner requested common size presets and confirmed earrings are One size. Ring sizes use labelled EU circumference in millimetres, not an ambiguous worldwide numeric standard: 48, 50, 52, 54, 56, 58, 60 and 62. Bracelets use finished lengths of 16–22 cm in 1 cm steps. Necklace length presets are 40, 45, 50, 55, 60 and 75 cm. These are editable offering defaults, not a claim that every manufacturer uses identical sizes.

References for measurement-system context: [Pandora ring size guide](https://uk.pandora.net/en/size-guide/guide-size-rings.html), [Tiffany necklace guide](https://www.tiffany.com/client-services/size-guide/necklaces-pendants-size.html).

The two material choices are **925 Silver** and **14K Gold Plated**. Plating is explicitly described as a surface finish, not solid gold. The owner confirmed that the plated option has a **separate per-product price**, configured in admin. Enable the plating checkbox and set the plated EUR price and, when selling that option to Türkiye, its TRY price. No surcharge was guessed or applied to existing products. The public option is shown but cannot be purchased where its offering/price is not configured.

Existing empty ring, bracelet and earring size arrays were backfilled using the approved defaults. A corrective migration ensures that “Earrings” is not mistaken for “Rings” by a substring match. Existing sets have no confirmed multi-piece sizing; the size control explains that confirmation is required rather than inventing a set size. Configure their actual choices in admin before offering them for checkout.

## Media and loading

- New image uploads are converted to WebP at the browser encoder's maximum quality without reducing original pixel dimensions. The editor checks input size and pixel count to prevent excessive decoding; uploads still have a 15 MB stored-file limit. WebP conversion is not described as restoring detail absent from the original photo.
- Both upload entry points require WebP for new images. Existing source files/storage objects are preserved, not mass-rewritten or deleted. Next.js serves responsive WebP derivatives to browsers that accept WebP, with quality 95 for catalog/thumbnail views and 100 for the main product view/zoom. Unknown external image hosts still need explicit safe configuration; no unrestricted image proxy is introduced.
- Product videos have explicit play/pause controls. Detail views retain native video controls; catalog cards offer playback without navigating into the card link. Video controls are centred below the top of arched cards so their hit area is not clipped by the decorative shape. Playback is user initiated and video preload is disabled.
- Catalog database media/pricing reads and admin stock/media reads run in parallel. Filtering uses the existing complete response. Menu photography mounts only while the menu is open and only for the active item. Full-resolution zoom imagery is not requested until inspection starts.
- These changes reduce avoidable requests; they are not a measured production Lighthouse score or a guarantee about every customer's network. The local preview still uses Next.js development mode, including first-visit compilation. No production build or deployment is claimed by this revision.

## Shipping and cookies

Shipping now uses **EsteeHouse** rather than separate collection names. The owner's corrected made-to-order estimate is **10–14 business days including production and carrier transit**, not production plus extra transit. Unsupported destinations and customs disruptions still require honest handling before accepting payment. The policy pages remain owner-review drafts until the legal seller and operations are ready.

Essential authentication cookies already exist. Cart and account-specific saved selections use localStorage. IP-country pricing does not need an additional location cookie or device GPS permission. No advertising pixel, analytics script, newsletter signup or new tracking-cookie banner was added. Optional tracking should be assessed and configured with any required consent before activation, not enabled behind an accept-all-only banner.

## Database changes and safeguards

- `20261018153552_catalog_taxonomy_and_archive.sql`: managed taxonomy, public-read/admin-server-write permissions, safe archival, dynamic branch support and requested option defaults.
- `20261018155339_correct_earring_one_size.sql`: correct earrings to One size.
- `20261018155957_guard_category_parent.sql`: prevent creating/restoring a category under an unavailable branch, including concurrent deletion races.

No live order, shipment, refund, stock quantity or payment was changed during validation. Database guard checks used transactions that rolled back all QA rows. Public/member execution of administrative taxonomy functions is revoked; browser requests still need server-verified administrator access.

Supabase advisory review still reports existing platform items such as long OTP expiry, disabled leaked-password protection and available Postgres security patches. Public catalog/taxonomy visibility is intentional under read-only RLS. This revision does not silently change authentication configuration, upgrade the database or claim a complete platform security clearance.

## Validation artifacts

- `outputs/catalog-followup-checks.json`: catalog/admin/API and sign-out checks; mutation UI requests intercepted instead of changing live catalog data.
- `outputs/media-auth-followup-checks.json`: valid option cleaning without writes, actual WebP responses, generated QA-only video play/pause, and customer-profile sign-out.
- `work/ui-qa/lint-catalog-followup.cjs`: targeted lint for the changed source.
- Screenshots: `outputs/admin-inset-editor.png`, `outputs/admin-inset-editor-mobile.png`, `outputs/catalog-removal-confirmation.png`.

Artifacts are in the Codex workspace, not public website routes. No credentials, magic-link tokens or authentication cookies are written into these reports.
