/* eslint-disable @next/next/no-img-element */
"use client";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
    title: "earrings",
    details: "bracelets are the best thing that",
    src: "/images/Products-page/necklesses-title.jpg",
    src2: "/images/Products-page/Wedding-ring.jpg",
    price: "100 €",
    type: "realistic",
  },
];
const uniqueType = Array.from(new Set(categories.map((cat) => cat.type)));
const uniqueCat = Array.from(new Set(categories.map((cat) => cat.title)));

function CategoriesPage() {
  /* const [selectedType, setSelectedType] = useState("all");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const[loading, setLoading] = useState(true)
  const [error, setError] = useState(null); */
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div className="w-screen h-full bg-gray-200 py-24">
      <div className="Hero-container flex items-center justify-center my-4 w-screen  bg-gray-400">
        <img
          src="/images/Hero-bg-3.jpg"
          alt="hero-image"
          className="w-screen h-[40rem] object-cover"
        />
      </div>
      <div className="h-20 w-full opacity-50 z-0 relative">
        <select className="absolute right-8 top-4 w-[1/8] h-1/2 rounded-md flex items*center justify-center outline-0 border-none px-4 uppercase">
          {uniqueType.map((type, index) => (
            <option key={index} value={type} className="text-gray-800">
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className=" w-full md:grid lg:grid-cols-4 flex flex-col items-center justify-center gap-5 md:gap-2 mt-14 px-10">
        <div className="category-list col-start-1 w-full h-full flex flex-col items-start ps-10 pt-20 justify-start group transition-all duration-300 ">
          <div className="">
            <h3 className="flex gap-10 font-dreamFont text-2xl font-semibold text-gray-800 mb-5">
              Categories
              <span
                onClick={() => setIsSelected(!isSelected)}
                className={`rotate-90 hover:cursor-pointer ${
                  isSelected ? "-rotate-90" : ""
                } transition-all duration-500`}
              >
                &gt;
              </span>
            </h3>
            {isSelected ? (
              <ul key={categories.id}>
                <Link
                  href="/productsId"
                  className=" flex flex-col gap-4 cursor-pointer uppercase group-hover:text-gray-900 group-hover:underline transition-all duration-300"
                >
                  {uniqueCat.map((type, index) => {
                    return (
                      <li key={index} className="text-gray-800 my-2">
                        {type}
                      </li>
                    );
                  })}
                </Link>
              </ul>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="category-items-card col-start-2 col-span-3 grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3 gap-16 cursor-pointer mx-5">
          {categories.map((category, index) => {
            return (
              <div
                className={`item-card relative group ${
                  index % 2 === 1 ? "md:mt-20" : ""
                }`}
                key={category.id}
              >
                <img
                  src={category.src}
                  alt={category.title}
                  className="w-full h-[36rem]"
                />
                <div
                  className={`w-full h-0 overflow-hidden group group-hover:h-full absolute bottom-0 left-0 group-hover:top-0 transition-all duration-500 `}
                >
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
// import { useEffect, useState } from "react";
