export default function manifest() {
  return {
    name: "EsteeHouse",
    short_name: "EsteeHouse",
    description: "EsteeHouse handmade jewelry and bags.",
    start_url: "/",
    display: "standalone",
    background_color: "#f1ecdf",
    theme_color: "#171714",
    orientation: "portrait-primary",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }
    ],
  };
}
