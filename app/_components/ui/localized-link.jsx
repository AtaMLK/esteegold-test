"use client";

import Link from "next/link";
import { useAppearance } from "../../context/appearanceContext";

export default function LocalizedLink({ href, ...props }) {
  const appearance = useAppearance();
  return <Link href={appearance.href(href)} {...props}/>;
}
