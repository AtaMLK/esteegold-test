/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState } from "react";
import "/styles/styles.css";

const categories = [
  {
    id: "1",
    title: "Rings",
    details: "rings are the best thing that",
    src: "/images/Products-page/Combinations.jpg",
    src2: "/images/Products-page/Earings-title.jpg",
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
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div className="w-screen h-full bg-gray-200 pb-24">
      {/* Hero image section */}
      <div className="category-hero-container ">
        <img
          src="/images/Hero-bg-3.jpg"
          alt="hero-image"
          className="w-screen h-[40rem] object-cover"
        />
      </div>

      {/* filter selection section */}
      <div className="xl:h-36 h-20 w-full opacity-50 z-0 relative flex items-center justify-center">
        <select className="filter-selection mb-10">
          {uniqueType.map((type, index) => (
            <option key={index} value={type} className="text-gray-800">
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* categories list ande images  */}
      <div className="category-container">
        {/* category list  */}
        <div className="category-list">
          <div className="flex item-center justify-center">
            <h3 className="font-dreamFont flex items-center text-2xl font-semibold text-gray-800 mb-2">
              Categories
              <span
                className={`ms-4 -rotate-90 hover:cursor-pointer font-normal text-3xl transition-all duration-500 ${
                  isSelected ? "rotate-90" : ""
                } `}
                onClick={() =>
                  setIsSelected(!isSelected, console.log(isSelected))
                }
              >
                &gt;
              </span>
            </h3>
          </div>

          {isSelected ? (
            <ul
              key={categories.id}
              className=" flex flex-col gap-2 items-center justify-center"
            >
              {uniqueCat.map((type, index) => (
                <li key={index}>
                  <Link
                    href="/productsId "
                    className="flex cursor-pointer uppercase pb-2 group text-gray-700 hover:underline hover:scale-125 hover:text-gray-800 transition-all duration-300"
                  >
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            ""
          )}
        </div>
        {/* category image */}
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
                  <div className="absolute h-0 w-full bottom-0 left-0 flex items-center justify-between opacity-50 bg-gray-800  group-hover:h-[20%] transition-all duration-400 text-white px-4 text-lg ">
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
