"use client";

import { useEffect, useRef } from "react";
import "@/app/globals.css";
import { useProductStore } from "@/app/_lib/ProductStore";

const config = {
  SCROLL_SPEED: 1.45,
  LERP_FACTOR: 0.05,
  MAC_VELOCITY: 150,
};

const state = {
  currentX: 0,
  targetX: 0,
  slideWidth: 390,
  slides: [],
  isDragging: false,
  startX: 0,
  lastX: 0,
  lastMouseX: 0,
  lastScrollTime: Date.now(),
  isMoving: false,
  velocity: 0,
  lastCurrentX: 0,
  dragDistance: 0,
  hasActuallyDragged: false,
  isMobile: false,
};

export default function ParallaxSlider() {
  const { products, fetchProducts } = useProductStore();
  const sliderRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    function checkMobile() {
      state.isMobile = window.innerWidth < 1000;
    }

    function createSlideElement(index) {
      const slide = document.createElement("div");
      slide.className = "slide";

      if (state.isMobile) {
        slide.style.width = "175px";
        slide.style.height = "250px";
      }

      const imageContainer = document.createElement("div");
      imageContainer.className = "slide-image";

      const img = document.createElement("img");
      const dataIndex = index % products.length;
      const product = products[dataIndex];
      const mainImage =
        product?.product_images?.find((img) => img.is_primary) ||
        product?.product_images?.[0];

      img.src = mainImage?.image_url || "/placeholder.jpg";
      img.alt = product.name || "Product";

      // === Overlay Element ===
      const overlay = document.createElement("div");
      overlay.className = "slider-overlay";

      // === Title Element ===
      const title = document.createElement("p");
      title.className = "project-title";
      title.textContent = product.name;

      // === Price Element ===
      const price = document.createElement("p");
      price.className = "project-price";
      price.textContent = product.price ? `${product.price} €` : "";

      // === Arrow Element ===
      const arrow = document.createElement("div");
      arrow.className = "project-arrow";
      arrow.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M7 17L17 7M17 7H7M17 7V17"/>
    </svg>`;

      // === Click navigation ===
      slide.addEventListener("click", (e) => {
        e.preventDefault();
        if (state.dragDistance < 10 && !state.hasActuallyDragged) {
          window.location.href = `/product/${product.id}`;
        }
      });

      // === Append elements ===
      overlay.appendChild(title);
      overlay.appendChild(price);
      overlay.appendChild(arrow);
      imageContainer.appendChild(img);
      slide.appendChild(imageContainer);
      slide.appendChild(overlay);

      return slide;
    }

    function initialSlides() {
      const track = sliderRef.current.querySelector(".slide-track");
      track.innerHTML = "";
      state.slides = [];

      checkMobile();
      state.slideWidth = state.isMobile ? 215 : 390;
      const copies = 10;
      const totalSlides = products.length * copies;

      for (let i = 0; i < totalSlides; i++) {
        const slide = createSlideElement(i);
        track.appendChild(slide);
        state.slides.push(slide);
      }

      const startOffset = -(products.length * state.slideWidth * 4);
      state.currentX = startOffset;
      state.targetX = startOffset;
    }

    function updateSlidePositions() {
      const track = sliderRef.current.querySelector(".slide-track");
      const sequenceWidth = state.slideWidth * products.length;

      if (state.currentX > -sequenceWidth * 1) {
        state.currentX -= sequenceWidth;
        state.targetX -= sequenceWidth;
      } else if (state.currentX < -sequenceWidth * 4) {
        state.currentX += sequenceWidth;
        state.targetX += sequenceWidth;
      }

      track.style.transform = `translate3d(${state.currentX}px,0,0)`;
    }

    function updateParallax() {
      const viewPortCenter = window.innerWidth / 2;

      state.slides.forEach((slide) => {
        const img = slide.querySelector("img");
        if (!img) return;

        const slideRect = slide.getBoundingClientRect();
        const slideCenter = slideRect.left + slideRect.width / 2;
        const distanceFromCenter = slideCenter - viewPortCenter;
        const parallaxOffset = distanceFromCenter * -0.25;

        img.style.transform = `translateX(${parallaxOffset}px) scale(1.75)`;
      });
    }

    function updateMovingState() {
      state.velocity = Math.abs(state.currentX - state.lastCurrentX);
      state.lastCurrentX = state.currentX;
      const isSlowEnough = state.velocity < 0.1;
      const hasBeenStillLongEnough = Date.now() - state.lastScrollTime > 200;
      state.isMoving =
        state.hasActuallyDragged || !isSlowEnough || !hasBeenStillLongEnough;

      document.documentElement.style.setProperty(
        "--slide-moving",
        state.isMoving ? "1" : "0"
      );
    }

    function animate() {
      state.currentX += (state.targetX - state.currentX) * config.LERP_FACTOR;
      updateMovingState();
      updateSlidePositions();
      updateParallax();
      requestAnimationFrame(animate);
    }

    function handleWheel(e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      state.lastScrollTime = Date.now();
      const scrollDelta = e.deltaY * config.SCROLL_SPEED;
      state.targetX -= Math.max(
        Math.min(scrollDelta, config.MAC_VELOCITY),
        -config.MAC_VELOCITY
      );
    }

    function handleTouchStart(e) {
      state.isDragging = true;
      state.startX = e.touches[0].clientX;
      state.lastX = state.targetX;
      state.dragDistance = 0;
      state.lastScrollTime = Date.now();
    }

    function handleTouchMove(e) {
      if (!state.isDragging) return;
      const deltaX = (e.touches[0].clientX - state.startX) * 1.5;
      state.targetX = state.lastX + deltaX;
      state.dragDistance = Math.abs(deltaX);
      if (state.dragDistance > 5) state.hasActuallyDragged = true;
      state.lastScrollTime = Date.now();
    }

    function handleTouchEnd() {
      state.isDragging = false;
      setTimeout(() => (state.hasActuallyDragged = false), 100);
    }

    function handleMouseDown(e) {
      e.preventDefault();
      state.isDragging = true;
      state.startX = e.clientX;
      state.lastMouseX = e.clientX;
      state.lastX = state.targetX;
      state.dragDistance = 0;
      state.hasActuallyDragged = false;
      state.lastScrollTime = Date.now();
    }

    function handleMouseMove(e) {
      if (!state.isDragging) return;
      e.preventDefault();
      const deltaX = e.clientX - state.lastMouseX;
      state.targetX += deltaX * 2;
      state.lastMouseX = e.clientX;
      state.dragDistance += Math.abs(deltaX);
      if (state.dragDistance > 5) state.hasActuallyDragged = true;
      state.lastScrollTime = Date.now();
    }

    function handleMouseUp() {
      state.isDragging = false;
      setTimeout(() => (state.hasActuallyDragged = false), 100);
    }

    function handleResize() {
      initialSlides();
    }

    function initializeEventListeners() {
      const slider = sliderRef.current;
      slider.addEventListener("wheel", handleWheel, { passive: false });
      slider.addEventListener("touchstart", handleTouchStart);
      slider.addEventListener("touchmove", handleTouchMove);
      slider.addEventListener("touchend", handleTouchEnd);
      slider.addEventListener("mousedown", handleMouseDown);
      slider.addEventListener("mouseleave", handleMouseUp);
      slider.addEventListener("dragstart", (e) => e.preventDefault());
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("resize", handleResize);
    }

    initialSlides();
    initializeEventListeners();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [products]);

  return (
    <div className="slider" ref={sliderRef}>
      <div className="slide-track"></div>
    </div>
  );
}
