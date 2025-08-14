import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  gsap.utils.toArray(".work-item").forEach((item) => {
    const img = item.querySelector(".work-item-img");
    const nameH1 = item.querySelector(".work-item-name h1");

    const split = new SplitText(nameH1, { type: "chars", charsClass: "char" });
    gsap.set(split.chars, { y: "125%" });

    // Timeline برای متن
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        end: "top 20%",
        scrub: 1
      }
    });

    tl.to(split.chars, {
      y: "0%",
      stagger: 0.05,
      ease: "none"
    });

    // انیمیشن ورود تصویر
    ScrollTrigger.create({
      trigger: item,
      start: "top bottom",
      end: "top top",
      scrub: 0.5,
      animation: gsap.fromTo(
        img,
        {
          clipPath: "polygon(25% 25%, 75% 40%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "none",
        }
      ),
    });

    // انیمیشن خروج تصویر
    ScrollTrigger.create({
      trigger: item,
      start: "bottom bottom",
      end: "bottom top",
      scrub: 0.5,
      animation: gsap.fromTo(
        img,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 75% 60%, 25% 75%)",
          ease: "none",
        }
      ),
    });
  });
});
