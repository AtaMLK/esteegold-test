import { permanentRedirect } from "next/navigation";

export default function GoldPage() {
  permanentRedirect("/silver");
}
