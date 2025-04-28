"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Spinner from "../_components/ui/Spinner";
import { supabase } from "../_lib/supabase";
import "./product.css";

gsap.registerPlugin(ScrollTrigger);

function Product() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const mouseRef = useRef();

  const positions = ["10rem", "17rem", "24rem", "31rem"];

  useEffect(() => {
    // Scroll to top on reload
    window.scrollTo(0, 0);
    const items = document.querySelectorAll(".item-card");

    /*   gsap.set(mouseRef.current, { opacity: 0.5 });

    // Blinking effect
    gsap.to(mouseRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Fade out on scroll
    gsap.to(mouseRef.current, {
      opacity: 0,
      scrollTrigger: {
        trigger: "body",
        start: "top+=100", // Adjust this value to control when it disappears
        scrub: true,
      },
    }); */

    items.forEach((item) => {
      gsap.set(item, { opacity: 0.1, y: 100 });
      gsap.to(item, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: item,
          start: "top 60%",
          end: "top 30%",
          scrub: 1,
        },
      });
    });
  }, []);

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
    };
    isLoading ? <Spinner /> : fetchCategories(), setIsLoading(false);
  }, [isLoading]);

  return (
    <div className="products-main-container">
      <div className="mouse-icon" ref={mouseRef}>
        {/* <Mouse /> */}
      </div>
      <div className="products-items">
        {categories.map((category, index) => (
          // Wrap each card in a Link to its detail page
          <Link href={`/categories/${category.id}`} key={category.title}>
            <div
              className={`item-card ${
                // Optionally add your positioning classes based on index
                index % 2 === 0 ? "left-[15rem]" : "right-[13rem]"
              }  
              `}
              style={{ top: positions[index] }}
            >
              <div className="relative w-[20rem] h-[28rem]">
                <Image
                  src={category.image_url}
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
    </div>
  );
}

export default Product;
