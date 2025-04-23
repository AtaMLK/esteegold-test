"use client";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";
import { Mouse } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/all";
import "./product.css";
import { supabase } from "../_lib/supabase";
import Spinner from "../_components/ui/Spinner";
import { PuffLoader } from "react-spinners";

gsap.registerPlugin(ScrollTrigger);

function Product() {
  const [isLoading, setIsLoading] = useState(true);
  const mouseRef = useRef();
  useEffect(() => {
    // Scroll to top on reload
    window.scrollTo(0, 0);
    const items = document.querySelectorAll(".item-card");

    gsap.set(mouseRef.current, { opacity: 0.5 });

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
    });

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

  const positions = ["10rem", "22rem", "34rem", "47rem", "62rem", "78rem"];
  const [categories, setCategories] = useState([]);

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
    isLoading ? <PuffLoader/> : fetchCategories(), setIsLoading(false);
  }, [categories, isLoading]);

  return (
    <div className="products-main-container">
      <div className="mouse-icon" ref={mouseRef}>
        <Mouse />
      </div>
      <div className="products-items">
        {categories.map(
          (category, index) => (
            console.log("Fetched categories:", category.image_url),
            (
              // Wrap each card in a Link to its detail page
              <Link href={`/product/${category.id}`} key={category.id}>
                <div
                  className={`item-card ${
                    // Optionally add your positioning classes based on index
                    index % 2 === 0 ? "left-[15rem]" : "right-[13rem]"
                  }  
             `}
                  style={{ top: positions[index] }}
                >
                  <div className="item-image">
                    <Image
                      src={category.image_url}
                      alt={category.title}
                      fill
                      /* sizes="100%" */
                      style={{ objectFit: "cover" }}
                      /* loading="lazy" */
                      /*  quality={85} */
                    />
                  </div>
                  <div className="card-item-content">
                    <h3 className="card-item-title">{category.title}</h3>
                    <p className="card-item-details">{category.details}</p>
                  </div>
                </div>
              </Link>
            )
          )
        )}
      </div>
    </div>
  );
}

export default Product;
