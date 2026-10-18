"use client";

import { useAppearance } from "../../context/appearanceContext";

import { Heart } from "lucide-react";
import { useWishlist } from "../../context/wishlistContext";
import { useUser } from "../../context/userContext";

export default function WishlistButton({ productId, compact = false }) {
  const { translateText } = useAppearance();
  const { has, toggle } = useWishlist();
  const saved = has(productId);
  const { authLoading } = useUser();
  return (
    <button
      type="button"
      disabled={authLoading}
      aria-label={saved ? translateText("Remove from wishlist") : translateText("Save to wishlist")}
      aria-pressed={saved}
      onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggle(productId); }}
      className={`group/heart flex items-center justify-center rounded-full border border-black/15 bg-[rgba(243,240,233,.82)] backdrop-blur-md transition hover:bg-black hover:text-white ${compact ? "h-9 w-9" : "h-11 w-11"}`}
    >
      <Heart size={compact ? 14 : 16} strokeWidth={1.5} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
