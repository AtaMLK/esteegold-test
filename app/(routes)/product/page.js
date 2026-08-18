"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import "./product.css";
import Spinner from "@/app/_components/ui/Spinner";

gsap.registerPlugin(ScrollTrigger);

function Product() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const mouseRef = useRef(null);

  const positions = ["10rem", "17rem", "24rem", "31rem"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .order("id");

      if (fetchError) {
        console.error("Error fetching categories:", fetchError.message);
        setError("Unable to load categories right now.");
        setCategories([]);
      } else {
        setCategories(data || []);
      }

      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isLoading || categories.length === 0) return;

    const cards = gsap.utils.toArray(".item-card");
    const animations = cards.map((item) =>
      gsap.fromTo(
        item,
        { opacity: 0.1, y: 100 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: item,
            start: "top 60%",
            end: "top 30%",
            scrub: 1,
          },
        }
      )
    );

    ScrollTrigger.refresh();

    return () => {
      animations.forEach((animation) => animation.scrollTrigger?.kill());
      animations.forEach((animation) => animation.kill());
    };
  }, [categories, isLoading]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="products-main-container">{error}</div>;
  }

  return (
    <div className="products-main-container">
      <div className="mouse-icon" ref={mouseRef} />

      <div className="products-items">
        {categories.map((category, index) => (
          <Link href={`/categories/${category.id}`} key={category.id}>
            <div
              className={`item-card ${
                index % 2 === 0 ? "left-[15rem]" : "right-[13rem]"
              }`}
              style={{ top: positions[index % positions.length] }}
            >
              <div className="relative w-[20rem] h-[28rem]">
                <Image
                  src={category.image_url}
                  alt={category.title || "Category"}
                  fill
                  sizes="320px"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <div className="card-item-content">
                <h3 className="card-item-title">{category.title}</h3>
                <p className="card-item-details">{category.details}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Product;
