import { permanentRedirect } from "next/navigation";

export default function ProductIndexPage() {
  permanentRedirect("/categories");
}
