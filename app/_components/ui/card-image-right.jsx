"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";
import CardImage from "./card-image";

gsap.registerPlugin(ScrollTrigger);

function CardImageRight({ file }) {
  const contentRef = useRef(null);
  const rightContainer = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width:768px)", () => {
      gsap.set(contentRef.current, { opacity: 0, x: 250 });
      gsap.set(rightContainer.current, { opacity: 0, x: -250 });
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
      gsap.to(rightContainer.current, {
        opacity: 1,
        x: 0,
        duration: 3,
        ease: "power1.out",
        scrollTrigger: {
          trigger: rightContainer.current,
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
          start: "top 90%",
          end: "top 70%",
          scrub: 1,
          immediateRender: false,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="right-container " ref={rightContainer}>
      <div className="card-content content-right -left-[10%]" ref={contentRef}>
        <h2 className="text-3xl text-bold">Design yourself</h2>
        <p className=" flex justify-start text-wrap ms-10">
          you can design your ring as you want and we will make it for you.
        </p>
      </div>
      <div className="relative col-start-2">
        <div
          className="absolute right-[30%] sm:right-[20%] md:right-[15%] lg:right-[2%] lg:me-10 "
          ref={imageRef}
        >
          <CardImage file={file} />
        </div>
        <h2 className="font-inter absolute right-[80%] sm:right-[70%] top-[50%] md:hidden text-3xl text-bold me-10 uppercase text-gray-600">
          <span className="bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent font-extrabold">
            Gallery
          </span>
        </h2>
      </div>
    </div>
  );
}

export default CardImageRight;
