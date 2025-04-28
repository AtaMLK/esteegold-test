"use client";

import "@/app/cart/cart.css";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import ItemQuantity from "../_components/ui/item-quantity";
import Image from "next/image";

function page() {
  return (
    <div className="cart-container">
      <div className="cart-wrapper  ">
        <div className="cart-box">
          <div className="cart-items ">
            <Link href={"/product/productId"}>  
              <Image
                src="/images/product/image-1.jpg"
                className="cart-item-image"
                alt="item.name"
                loading="lazy"
                fill
              />
            </Link>
            <p className="cart-item-name">name of the product</p>
          </div>
          <div className="cart-item-price">
            <p>
              92 <span>$</span>
            </p>
          </div>
          <div className="cart-items-quantity ">
            <ItemQuantity />
          </div>
          <div className="cart-items-delete">
            <Trash2 className="text-red-400 " />
          </div>
        </div>
        <div className="cart-box">
          <div className="cart-items">
            <Link href={"/product/Id"}>
              <Image
                src="/images/product/image-2.jpg"
                className="cart-item-image"
                alt="item.name"
                loading="lazy"
                fill
              />
            </Link>
            <p className="cart-item-name">name of the product</p>
          </div>
          <div className="cart-item-price">
            <p>
              48 <span>$</span>
            </p>
          </div>
          <div className="cart-items-quantity">
            <ItemQuantity />
          </div>
          <div className="cart-items-delete">
            <Trash2 className="text-red-400 " />
          </div>
        </div>
        <div className="cart-box ">
          <div className="cart-items">
            <Link href={"/product/Id"}>
              <Image
                src="/images/product/image-3.jpg"
                className="cart-item-image"
                alt="image-1"
                loading="lazy"
                fill
              />
            </Link>
            <p className="cart-item-name">name of the product</p>
          </div>
          <div className="cart-item-price">
            <p>
              118 <span>$</span>
            </p>
          </div>
          <div className="cart-items-quantity ">
            <ItemQuantity />
          </div>
          <div className="cart-items-delete">
            <Trash2 className="text-red-400" />
          </div>
        </div>
        <div className="cart-total mb-16 pb-6 flex items-center justify-end  gap-10 me-2 right-0 mt-8 border-b-2 border-gray-800 text-lg text-gray-900">
          <div className="cart-total-amount text-sm lg:text-xl flex gap-4">
            <span>5</span>Pcs of your ambition
          </div>
          <div className="cart-total-quantity">
            <p className="text-sm lg:text-2xl ">
              250 <span className="font-bold">$</span>
            </p>
          </div>
        </div>
        <div className="cart-button mt-8 w-full px-[5%] lg:px-[10%]">
          <Link href="/checkout">
            <Button
              variant="outline"
              className="w-full border-[1px] text-lightgreen-800 text-sm border-darkgreen-800 bg-lightgreen-400 hover:bg-green-800 hover:border-lightgreen-400 hover:text-lightgreen-200 mt-5 transition-all duration-500"
              redirect="/"
            >
              <p>Finish You purchase</p>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
