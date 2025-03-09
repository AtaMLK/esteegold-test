"use client";

import "@/styles/styles.css";

const image = [0, 1];

function CardImage({ file }) {
  const handleMouseEnter = (e, index) => {
    const images = e.currentTarget.querySelectorAll(".card-container-images");

    images.forEach((img, idx) => {
      if (idx === index) {
        img.style.zIndex = "10"; // Bring the hovered image to the top
        img.style.transform = `rotate(${idx * 12}deg) scale(1.2)`; // Rotate and scale the image
        img.style.transition = "transform 0.5s ease, z-index 0.3s ease";
      } else {
        img.style.zIndex = "1"; // Reset z-index of other images
        img.style.transform = "rotate(0deg) scale(1) "; // Reset their transformations
        img.style.transition = "transform 0.5s ease, z-index 0.3s ease";
      }
    });

    images.forEach((img, index) => {
      img.style.transform = `rotate(${index * 20}deg) translateX(25px)`;
      img.style.transitionDuration = index === 0 ? "0.5s" : "1s";
    });
  };

  const handleMouseLeave = (e) => {
    const images = e.currentTarget.querySelectorAll(".card-container-images");
    images.forEach((img) => {
      img.style.transform = "rotate(0deg)";
    });
  };

  return (
    <div
      className="card-container "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full container-image">
        {image.map((_, index) => (
          <img
            key={index}
            src={`/images/${file}/image-${index + 1}.jpg`}
            className="card-container-images transition-transform absolute w-full m-full object-cover rounded-xl"
            alt={`Image ${index + 1}`}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

export default CardImage;
