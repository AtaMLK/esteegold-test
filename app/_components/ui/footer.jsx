import {
  ArrowDownRightIcon,
  LucideCopyright,
  LucideInstagram
} from "lucide-react";
import Link from "next/link";
const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-content ms-10 mb-5 ">
        <div className="footer-contactitems flex flex-col gap-2 ">
          <Link href="/contact">
            <p>contact</p>
          </Link>
          <Link href="/about">
            <p>about</p>
          </Link>
          <Link href="/specialOrder">
            <p>Order Your Design</p>
          </Link>
          <Link href={instagramUrl} target="_blank">
            <LucideInstagram />
          </Link>
        </div>
        <div className="footer-subscribe w-full flex mt-5 justify-center items-center  ">
          <label htmlFor="subscribe"> Subscribe </label>
          <span>
            <ArrowDownRightIcon />
          </span>
          <input
            type="email"
            id="subscribe"
            className=" w-[30%] border-[1px] border-gray-700 h-10 outline-none ps-2 hover:w-[50%] cursor-pointer transition-all duration-500 hover:shadow-lg hover:h-12 hover:shadow-gray-500 "
          />
        </div>
        <div className="footer-copyright flex justify-end items-center me-10 mt-2 text-xs">
          All rights <LucideCopyright />
          belong to Estoo gold studio
        </div>
      </div>
    </div>
  );
}

export default Footer;
{
  /* <div className="footer w-full flex justify-between items-center text-xs md:text-md bg-gray-700 p-2">
      <p>
        You can subscribe in our newsLetter to see our newwest model faster
        thaan everyone
      </p>

      <div className="flex flex-center gap-1 text-xs">
        <span>
          <CopyrightIcon />
        </span>
        <p className=" text-xs">All rights belong to Estee Gold Stuio 2025</p>
      </div>
      <div className="flex gap-2">
        <Instagram className=" cursor-pointer hover:text-gray-400 hover:scale-110 transition-all duration-300 " />
        <Twitter className=" cursor-pointer transition-all duration-300 hover:text-gray-400 hover:scale-125" />
      </div>
    </div> */
}
