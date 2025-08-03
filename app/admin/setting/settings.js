export const settings = [
  {
    name: "Default Currency",
    slug: "currency",
    type: "select",
    options: ["USD", "EUR", "TRY", "GBP"],
    default: "EUR",
  },
  {
    name: "Default Language",
    slug: "language",
    type: "select",
    options: ["en", "tr", "de", "fa"],
    default: "en",
  },
  {
    name: "Enable Free Shipping",
    slug: "free_shipping",
    type: "boolean",
    default: false,
  },
  {
    name: "Tax Rate (%)",
    slug: "tax_rate",
    type: "number",
    default: 18,
  },
];
