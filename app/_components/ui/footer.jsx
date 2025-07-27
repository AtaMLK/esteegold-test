"use client";

import {
  ArrowDownRightIcon,
  LucideCopyright,
  LucideInstagram,
} from "lucide-react";
import Link from "next/link";

const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-content ms-10 mb-5">
        {/* Navigation Links */}
        <div className="footer-contactitems flex flex-col gap-2">
          <Link href="/contact"><p>contact</p></Link>
          <Link href="/about"><p>about</p></Link>
          <Link href="/specialOrder"><p>Design your requested Rings</p></Link>

          {/* Instagram Link */}
          {instagramUrl && (
            <Link href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <LucideInstagram />
            </Link>
          )}
        </div>

        {/* Subscribe Input */}
        <div className="footer-subscribe w-full flex mt-5 justify-center items-center h-20">
          <label htmlFor="subscribe">Subscribe</label>
          <span className="ms-2">
            <ArrowDownRightIcon />
          </span>
          <input
            type="email"
            id="subscribe"
            className="w-[30%] border border-gray-700 h-10 outline-none ps-2 hover:w-[50%] cursor-pointer transition-all duration-500 hover:shadow-lg hover:h-12 hover:shadow-gray-500"
          />
        </div>

        {/* Copyright */}
        <div className="footer-copyright flex justify-end items-center me-10 mt-2 text-xs">
          All rights <LucideCopyright className="mx-1" />
          belong to Estee Gold Studio
        </div>
      </div>
    </div>
  );
}

export default Footer;
