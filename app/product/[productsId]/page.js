/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import Checkbox from "../../_components/Checkbox";
import "./../../product/product.css";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ItemQuantity from "../../_components/ItemQuantity";

const stoneType = [
  { index: 1, label: "Diamond" },
  { index: 2, label: "Artifitial Diamond" },
];

const necklesSizes = [
  { index: 1, options: 40 },
  { index: 2, options: 45 },
];

function page() {
  const handleChange = (e) => {
    e.preventDefault();
    setSelectedOption(e.target.value);
  };
  return (
    <>
      <div className="w-full h-full mb-28"></div>
      <div className="dynamic-product-container">
        <div className="product-mainbox">
          <div className="product-left w-full">
            <div className="slider">
              <Carousel>
                <CarouselContent>
                  <CarouselItem>
                    <img
                      src="./../images/gallery/image-1.JPG"
                      alt="slider"
                      className="slider-image"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img
                      src="./../images/gallery/image-2.JPG"
                      className="slider-image"
                      alt="slider"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img
                      src="./../images/gallery/image-3.JPG"
                      className="slider-image"
                      alt="slider"
                    />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
          <div className="product-right justify-start relative">
            <div className="product-right-details flex flex-col gap-2">
              <h2 className="product-name font-semibold text-lg">
                Product Name
              </h2>
              <h3 className="product-price font-semibold my-5"> 180.00 $</h3>
              <div className="product-material flex flex-col flex-center gap-3 justify-start mb-3">
                <h2 className="product-name font-semibold text-lg">
                  Choose Color
                </h2>
                <div className="product-color flex gap-5">
                  <div className="circle bg-gold">Gold</div>
                  <div className="circle bg-silver">
                    <p>Silver</p>
                  </div>
                </div>
              </div>
              <div className="Length">
                <select
                  name="Select Length"
                  id="options"
                  onChange={handleChange}
                  className="border-[1px] border-gray-700 w-14 h-8 rounded-sm"
                >
                  {necklesSizes.map((option, index) => (
                    <option value={option.options} key={index}>
                      {option.options}
                    </option>
                  ))}
                </select>
              </div>
              <div className="product-stone">
                <h3 className="font-semibold">Choose your Glime </h3>
                {stoneType.map((stone, index) => {
                  return (
                    <div
                      className="flex items-center gap-2 justify-start my-2"
                      key={index}
                    >
                      <Checkbox />
                      <p className=" text-sx ">{stone.label}</p>
                    </div>
                  );
                })}
              </div>
              <ItemQuantity />
              <Button
                variant="default"
                className="border-[1px] border-lightgreen-800 font-bold text-lg text-darkgreen-800 bg-lightgreen-400 mt-5"
                onClick={() => {}}
              >
                Add To Card
              </Button>
            </div>
          </div>
        </div>
        <div className="product-content m-5 row-start-2 col-span-2 flex justify-center items-center">
          <p className=" row-start-2 w-full h-100  p-5 border-[1px] border-gray-700 text-sm">
            of type and scrambled it to make a type specimen book. It has
            survived not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        </div>
      </div>
    </>
  );
}

export default page;
