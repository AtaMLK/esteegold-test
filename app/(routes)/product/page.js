"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/_lib/supabaseClient";
import "./product.css";
import Spinner from "@/app/_components/ui/Spinner";

gsap.registerPlugin(ScrollTrigger);

function Product() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const mouseRef = useRef();
  const containerRef = useRef();

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      let { data: categories, error } = await supabase
        .from("categories")
        .select("*");
      if (error) {
        console.error("Error fetching categories:", error.message);
      } else {
        setCategories(categories);
      }
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  // Animate cards using GSAP Timeline
  useEffect(() => {
    if (categories.length === 0) return;

    const items = document.querySelectorAll(".item-card");

    // Create a ScrollTrigger timeline
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "+=2000", // length of scroll (adjust as needed)
        scrub: 1,
      },
    });

    items.forEach((item, i) => {
      const fromX = i % 2 === 0 ? 300 : -300; // even → from right, odd → from left
      const rotate = i % 2 === 0 ? -15 : 15; // initial rotation

      // Step 1: Card entry animation
      timeline.fromTo(
        item,
        { opacity: 0, x: fromX, rotateZ: rotate },
        {
          opacity: 1,
          x: 0,
          
          duration: 1.2,
          ease: "power3.out",
          onStart: () => {
            // Step 2: Slight nudge for previous cards
            items.forEach((prev, j) => {
              if (j < i) {
                const bounceRotate = j % 2 === 0 ? 3 : -3;
                gsap.to(prev, {
                  rotateZ: bounceRotate,
                  duration: 0.3,
                  yoyo: true,
                  repeat: 1,
                  ease: "power1.inOut",
                });
              }
            });
          },
        }
      );

      // Step 3: Keep cards independent, no stacking in the middle
      timeline.to(
        item,
        {
          x: 0, // maintain the horizontal path
          rotateZ: rotate, // keep initial rotation if desired
          duration: 0.6,
          ease: "power1.inOut",
        },
        ">-0.8" // overlap slightly with entry animation
      );
    });
  }, [categories]);

  return (
    <div className="products-main-container mt-60" ref={containerRef}>
      <div className="mouse-icon" ref={mouseRef}></div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="products-items relative flex">
          {categories.map((category) => (
            <Link href={`/categories/${category.id}`} key={category.title}>
              <div className="item-card absolute w-[20rem] h-[28rem]">
                <div className="relative w-full h-full">
                  <Image
                    src={category?.image_url}
                    alt={category.title}
                    fill
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
      )}
    </div>
  );
}

export default Product;
