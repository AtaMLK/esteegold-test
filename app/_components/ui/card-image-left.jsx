"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";
import CardImage from "./card-image";

gsap.registerPlugin(ScrollTrigger);

function CardMainLeft({ file }) {
  const contentRef = useRef(null);
  const leftContainer = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width:768px)", () => {
      gsap.set(contentRef.current, { opacity: 0, x: 250 });
      gsap.set(leftContainer.current, { opacity: 0, x: -250 });
      gsap.set(imageRef.current, { opacity: 0, y: 100 });

      gsap.to(contentRef.current, {
        opacity: 1,
        x: 0,
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 90%",
          end: "top 70%",
          scrub: 1,
          immediateRender: false,
        },
      });
      gsap.to(leftContainer.current, {
        opacity: 1,
        x: 0,
        duration: 3,
        ease: "power1.out",
        scrollTrigger: {
          trigger: leftContainer.current,
          start: "top 90%",
          end: "top 70%",
          scrub: 1,
          immediateRender: false,
        },
      });
      gsap.to(imageRef.current, {
        opacity: 1,
        y: 0,
        duration: 2.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 80%",
          end: "top 60%",
          scrub: 1,
          immediateRender: false,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="left-container" ref={leftContainer}>
      <div className="relative col-start-1">
        <div className="lg:me-20  relative image" ref={imageRef}>
          <CardImage file={file} />
        </div>
        <h2 className=" absolute left-[70%] top-[50%] md:hidden text-3xl text-bold me-10 uppercase text-gray-600">
          <span className=" font-dreamFont bg-gradient-to-r from-gray-400 to-gray-900 bg-clip-text text-transparent font-extrabold">
            product
          </span>
        </h2>
      </div>
      <div className="card-content content-left -right-[10%]" ref={contentRef}>
        <h2 className="text-3xl text-bold">Products</h2>
        <p className=" flex justify-start text-wrap me-10">
          you can select all the shiny jeweles in the full verion of our shops.
        </p>
      </div>
    </div>
  );
}

export default CardMainLeft;
