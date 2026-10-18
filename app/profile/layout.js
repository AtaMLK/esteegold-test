import { pageMetadata } from "../_lib/seo";

export const metadata = pageMetadata({ title: "Your Account | EsteeHouse", path: "/profile", noindex: true });

export default function PrivateLayout({ children }) { return children; }
