import { pageMetadata } from "../_lib/seo";

export const metadata = pageMetadata({ title: "Your Account | EsteeHouse", path: "/auth/login", noindex: true });

export default function AuthLayout({ children }) { return children; }
