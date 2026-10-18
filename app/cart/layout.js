import { pageMetadata } from "../_lib/seo";

export const metadata = pageMetadata({ title: "Shopping Bag | EsteeHouse", path: "/cart", noindex: true });

export default function PrivateLayout({ children }) { return children; }
