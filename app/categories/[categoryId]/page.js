/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import ItemCards from "../../_components/ui/ItemCards";
import { useProducts } from "@/app/context/Productcontext";
import "/styles/styles.css";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import Spinner from "@/app/_components/ui/Spinner";

/* const uniqueType = Array.from(new Set(categories.map((cat) => cat.type))); */

function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const { products, loading } = useProducts();
  const { categoryId } = useParams();

  const uniqueCat = Array.from(
    new Set(products.map((cat) => cat.categories?.title))
  );

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => product.categories?.title === selectedCategory
      )
    : products;

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="w-screen h-full bg-gray-200 pb-24 over">
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
        <select
          className="filter-selection mb-10"
          value={selectedCategory.length ? selectedCategory : ""}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
          }}
        >
          <option value="" className="text-gray-800">
            All Categories
          </option>
          {uniqueCat.map((cat, index) => (
            <option key={index} value={cat} className="text-gray-800">
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* categories list ande  category sub-items  */}
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
                onClick={() => setIsSelected(!isSelected)}
              >
                &gt;
              </span>
            </h3>
          </div>

          {isSelected ? (
            <ul className=" flex flex-col gap-2 items-center justify-center">
              {uniqueCat.map((cat, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedCategory(cat)}
                  className="flex cursor-pointer uppercase pb-2 group text-gray-700 hover:underline hover:scale-125 hover:text-gray-800 transition-all duration-300"
                >
                  {cat}
                </li>
              ))}
            </ul>
          ) : (
            ""
          )}
        </div>
        {/* Product images  */}
        <ItemCards product={filteredProducts} />
      </div>
    </div>
  );
}

export default CategoriesPage;
