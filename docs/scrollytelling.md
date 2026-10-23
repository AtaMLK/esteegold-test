# EsteeHouse product stories

Branch: `feat/esteehouse-scrollytelling`.

The home page introduces EsteeHouse with silver first. `/silver` tells a six-scene lotus-ring story (suspended, falling, stone, water, return, worn). `/bags` tells a five-scene story using the same blue, grey and orange paracord bag throughout. Normal vertical scrolling drives alternating diagonal scene travel; it does not intercept wheel or touch events. The bottom range control seeks the same scroll position and supports native keyboard controls. Arrows advance one scene. Shopping links are available throughout.

`cinematic-journey.jsx` owns progress, accessibility and navigation. `product-stories.js` contains English and Turkish scenes. `cinematic-journey.css` contains the responsive compositions. The existing collection gallery and commerce routes remain connected.

## Assets and provenance

All five original JPGs were supplied by the owner on 2026-10-23. Originals remain untouched. Public assets are converted to WebP and limited to 1800 × 2000 pixels, retaining photographic detail.

- `lotus-worn.webp`: supplied photograph of the actual lotus ring worn on a hand.
- `blue-stone.webp`: supplied photograph of the actual bag on stone.
- `blue-carried.webp`, `blue-detail.webp`: supplied photographs of the same bag, rotated for portrait presentation.
- `blue-orange.webp`: supplied photograph of the same bag against orange mesh.
- `lotus-cutout.webp`: reference-derived transparent product illustration prepared with built-in ImageGen. The owner corrected the material to **925 sterling silver throughout, with no gold**. The selected version follows that correction. The occluded rear of the ring is reconstructed; it is not a measured 3D model.

The final ImageGen correction prompt was: “The ENTIRE material is 925 sterling SILVER. Remove ALL gold, yellow and brass coloration from the lotus petals, engraved edges, face and band. Every metallic surface must be neutral cool silver, with dark oxidized engraved petal outlines. Preserve exact flower engraving, petal shapes, shoulders, proportions, camera angle and ring design. Keep the genuine transparent background.”

## Motion and video

This sample uses product-image transforms and graphic water ripples. It does not claim to show real footage of a ring falling, hands picking it up, or immersion. The water scene is illustrative, not a water-resistance claim. Existing photography supplies the final worn scene.

A separate Motion video was requested (job `907083da-de02-419a-997c-1c1475717eb8`), but paused because the Motion balance was zero. The silver-only correction was sent to that job. No generated MP4 has been added and no credits have been purchased. The owner-mentioned HEIC files and MP4 were absent at their supplied local paths during implementation.

## Accessibility and preview

- Reduced-motion preference defaults to the still edition; the visible toggle lets visitors switch editions.
- Inactive scenes are inert and hidden from assistive technology.
- Native range keyboard controls, previous/next buttons and visible focus styles are retained.
- Without JavaScript, all scenes remain available as a normal page.
- English and Turkish stories share the same actual product references.

For local preview, supply the existing application's public environment variables and run `npm run dev`. Temporary placeholder public values were used for visual QA because this checkout has no `.env.local`; live catalog/authentication/payment behavior was not validated. No database, authentication, payment or hosting configuration was changed.
