/* eslint-disable @next/next/no-img-element */
"use client";
import { FileType2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: "1",
    title: "Rings",
    details: "rings are the best thing that",
    src: "/images/Products-page/Combinations.jpg",
    type: "old fashioned",
  },
  {
    id: "2",
    title: "Necklaces",
    details: "necklaces are the best thing that",
    src: "/images/Products-page/Wedding-ring.jpg",
    src2: "/images/Products-page/rings-title.jpg",
    price: "100 €",
    type: "minimalistic",
  },
  {
    id: "3",
    title: "Bracelets",
    details: "bracelets are the best thing that",
    src: "/images/Products-page/Earings-title.jpg",
    src2: "/images/Products-page/rings-title.jpg",
    price: "100 €",
    type: "modern",
  },
  {
    id: "4",
    title: "Rings",
    details: "rings are the best thing that",
    src: "/images/Products-page/rings-title.jpg",
    src2: "/images/Products-page/Earings-title.jpg",
    price: "100 €",
    type: "minimalistic",
  },
  {
    id: "5",
    title: "Necklaces",
    details: "necklaces are the best thing that",
    src: "/images/Products-page/hand Combinations.jpg",
    src2: "/images/Products-page/rings-title.jpg",
    price: "100 €",
    type: "minimalistic",
  },
  {
    id: "6",
    title: "Bracelets",
    details: "bracelets are the best thing that",
    src: "/images/Products-page/necklesses-title.jpg",
    src2: "/images/Products-page/Wedding-ring.jpg",
    price: "100 €",
    type: "realistic",
  },
];
const uniqueType = Array.from(new Set(categories.map((cat) => cat.type)));

function CategoriesPage() {
  return (
    <div className="w-screen h-full ">
      <div className="Hero-container flex items-center justify-center my-4 w-screen">
        <img
          src="/images/Hero-bg-3.jpg"
          alt="hero-image"
          className="w-screen h-[40rem] object-cover"
        />
      </div>
      <div className="h-20 w-full bg-gray-600 opacity-50 z-0 relative">
        <select className="absolute right-8 top-4 w-[1/8] h-1/2 rounded-md flex items*center justify-center outline-0 border-none px-4 uppercase">
          {uniqueType.map((type, index) => (
            <option key={index} value={type} className="text-gray-800">
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className=" w-full grid grid-cols-4 gap-2 mt-14 ">
        <div className="category-list col-start-1 w-full h-full flex flex-col items-start ps-10 pt-20 justify-start group transition-all duration-300 ">
          <ul key={categories.id}>
            <Link
              href={`/categories/${categories.id}`}
              className=" flex flex-col gap-4 cursor-pointer uppercase group-hover:text-gray-900 group-hover:underline leading-4"
            >
              {uniqueType.map((type, index) => {
                return (
                  <li key={index} className="text-gray-800 my-2">
                    {type}
                  </li>
                );
              })}
            </Link>
          </ul>
        </div>
        <div className="category-items-card col-start-2 col-span-3 grid grid-cols-3 gap-8 cursor-pointer mx-5">
          {categories.map((category, index) => {
            return (
              <div
                className={`item-card relative group ${
                  index % 2 === 1 ? "mt-20" : ""
                }`}
                key={category.id}
              >
                <img
                  src={category.src}
                  alt={category.title}
                  className="w-full h-[36rem]"
                />
                <div className={`w-full h-0 overflow-hidden group group-hover:h-full absolute bottom-0 left-0 group-hover:top-0 transition-all duration-400 ${
                  index % 2 === 0 ? "mt-20" : ""
                }`}>
                  <img
                    src={category.src2}
                    alt={category.title}
                    className="w-full h-full "
                  />
                  <div className="absolute h-0 w-full bottom-0 left-0 flex items-center justify-between opacity-50 bg-gray-800  group-hover:h-[20%] transition-all duration-[700] text-white px-4 text-lg ">
                    <p>{category.title}</p>
                    <p>{category.price}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
