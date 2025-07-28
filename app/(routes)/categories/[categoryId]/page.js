  /* eslint-disable @next/next/no-img-element */
  "use client";
  import Spinner from "@/app/_components/ui/Spinner";
  import { useProductStore } from "@/app/_lib/ProductStore";
  import { useParams } from "next/navigation";
  import { useEffect, useState } from "react";
  import ItemCards from "@/app/_components/ui/ItemCards";
  import "/styles/styles.css";

  function CategoriesPage() {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categoryListOpen, isCategoryListOpen] = useState(false);
    const { products, loading, fetchProducts } = useProductStore();
    const { categoryId } = useParams();

    useEffect(() => {
  fetchProducts();
}, []);

    const uniqueCat = Array.from(
  new Set(products.map((cat) => cat.categories?.title).filter(Boolean))
);


    const filteredProducts = selectedCategory
      ? products.filter(
          (product) => product.categories?.title === selectedCategory
        )
      : products;

    useEffect(() => {
      console.log("producs", products);
      if (categoryId) {
        setSelectedCategory(decodeURIComponent(categoryId));
        isCategoryListOpen(true);
      }
    }, [categoryId]);

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
            <div className="flex items-center justify-center">
              <h3 className="font-inter flex items-center text-2xl font-semibold text-gray-800 mb-2">
                Categories
                <span
                  className={`ms-4 -rotate-90 hover:cursor-pointer font-normal text-3xl transition-all duration-500 ${
                    categoryListOpen ? "rotate-90" : ""
                  } `}
                  onClick={() => isCategoryListOpen(!categoryListOpen)}
                >
                  &gt;
                </span>
              </h3>
            </div>

            {categoryListOpen ? (
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
