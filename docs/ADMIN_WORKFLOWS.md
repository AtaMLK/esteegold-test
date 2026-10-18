# Admin workflows

## Product options

- Choose **Bags** or **Silver** when creating or editing a product. Internal branch identifiers remain `EsteeBags` and `EsteeGold` for compatibility.
- Bags do not have metal, size, stone, or gold options. The editor disables these controls and clears stale values when switching to Bags. The server independently strips them from create/update requests. Bag personalization notes, regular prices, stock on creation, and visibility remain available.
- Silver materials, sizes, and stones are multi-select buttons. Choose a size type before selecting its size presets; changing the type clears the old size selection. Existing saved custom option values remain visible rather than being silently deleted.
- Materials include 925 Sterling Silver, 14K Gold and 18K Gold. Ring, bracelet and necklace presets reflect the existing catalog conventions.
- Ten named stone choices are Onyx, Amethyst, Rose Quartz, Clear Quartz, Citrine, Garnet, Moonstone, Turquoise, Lapis Lazuli and Peridot. None, Natural stone and Cubic zirconia remain available too. These are editable offerings, not claims about a product's actual composition or gemstone certification.
- Required stone selection needs at least one configured stone and cannot include None. Gold ordering requires a configured EUR gold price. Turning gold ordering off clears unused gold prices on save.
- Existing stock is read-only in product editing. Use **Inventory** for non-zero, reasoned stock adjustments; the audit actor comes from the verified administrator, not a client-supplied name.
- A product saved before an upload failure stays in edit mode, so retrying its media does not create another product. Up to twelve media files may be submitted per upload.

## Orders and shipments

- Order status controls expose only allowed lifecycle transitions. Unpaid orders cannot be manually marked paid without a successful payment record.
- Shipment timestamps display in the administrator's browser timezone and serialize back to UTC.
- The approved `atomic_admin_shipment_save` migration adds the server-only `save_commerce_shipment(jsonb)` function. It locks the order and commits shipment details and lifecycle changes in one transaction. Invalid payment state, missing shipping dates, or delivery before shipping reject the entire save.
- No existing products, stock, orders or shipments are changed by applying that migration. Do not replay historical seed/demo migrations against the current database.

## Presentation and keyboard access

The global scrollbar uses the site's cream track and muted olive thumb, rounded edges and no decorative arrow buttons. Native scrolling remains available; high-contrast mode retains system colors. The product editor supports Escape, keyboard focus containment, focus restoration and background-scroll locking.

## Safe verification

Use read-only live checks and intercepted browser requests for product/status/shipment save tests. Do not create demo commerce records or run live purchases, refunds, or stock movements solely to verify the dashboard. Production deployment and provider end-to-end testing are separate steps.
