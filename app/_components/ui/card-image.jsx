"use client";

import "@/styles/styles.css";

const image = [0, 1, 3];

function CardImage({ file }) {
  const handleMouseEnter = (e, index) => {
    const images = e.currentTarget.querySelectorAll(".card-container-images");

    images.forEach((img, idx) => {
      // Generate unique random values for each image
      const randomX = (Math.random() - 0.5) * 200; // Random between -40px and 40px
      const randomY = (Math.random() - 0.5) * 100; // Random between -40px and 40px

      img.style.zIndex = "10"; // Bring hovered image to top
      img.style.transform = `translate(${randomX}px, ${randomY}px) `;
      img.style.transition =
        "transform 0.4s ease-in-out, z-index 0.3s ease-in-out";
        img.style.width="15rem"
        img.style.height="15rem"
    });
  };

  const handleMouseLeave = (e) => {
    const images = e.currentTarget.querySelectorAll(".card-container-images");
    images.forEach((img) => {
      img.style.transform = " translateX(0) translateY(0)";
      img.style.width="100%"
        img.style.height="100%"
      img.style.objectFit = "cover";
    });
  };

  return (
    <div
      className="card-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full container-image">
        {image.map((_, index) => (
          <img
            key={index}
            src={`/images/${file}/image-${index + 1}.jpg`}
            className="card-container-images transition-transform absolute w-full h-full object-cover rounded-xl"
            alt={`Image ${index + 1}`}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

export default CardImage;
