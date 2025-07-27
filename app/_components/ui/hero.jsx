"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [0, 1, 2, 3];
const transitionDuration = 5;

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sectionWidth, setSectionWidth] = useState(0);

// space width
  const containerPadding = 5 * 12;

  useEffect(() => {
    const width = (window.innerWidth - 2 * containerPadding) / 4;
    setSectionWidth(width);

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, transitionDuration * 1000);

    return () => clearInterval(interval);
  }, []);

  const contentPositions = [
    { left: `${containerPadding}px` },
    { left: `${containerPadding + sectionWidth}px` },
    { left: `${containerPadding + sectionWidth * 2}px` },
    { left: `${containerPadding + sectionWidth * 3}px` },
  ];

  return (
    <div className="hero-container relative overflow-hidden">
      {/* Images */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {images.map((_, index) =>
            index === activeIndex ? (
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={`/images/Hero-bg-${index + 1}.jpg`}
                  alt="hero-img"
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* Content & Progress Bar */}
      <motion.div
        className="hero-content absolute bottom-10 text-center bg-transparent p-4 rounded-lg"
        animate={{ left: contentPositions[activeIndex].left }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <p className="text-lg font-normal text-gray-700">
          Wear your lovely pet
        </p>

        {/* Progress Bar */}
        <div className="relative w-full h-[3px] bg-lightgreen-500 mt-2 overflow-hidden rounded-full">
          <motion.div
            key={activeIndex}
            className="absolute left-0 top-0 h-full bg-darkgreen-600"
            initial={{ width: "0%" }}
            animate={{ width: "120%" }}
            transition={{ duration: transitionDuration, ease: "linear" }}
          />
        </div>

        <Button variant="outline" className="hero-button mt-3">
          Discover the beyond
        </Button>
      </motion.div>
    </div>
  );
}

export default Hero;
