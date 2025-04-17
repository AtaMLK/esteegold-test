import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EuroIcon } from "lucide-react";
import { useState } from "react";

const productColor = ["bg-gold", "bg-silver"];
const productImages = [
  { imgUrl: "/images/gallery/imagee-1.jpg" },
  { imgUrl: "/images/gallery/imagee-2.jpg" },
  { imgUrl: "/images/gallery/imagee-3.jpg" },
  { imgUrl: "/images/gallery/imagee-4.jpg" },
  { imgUrl: "/images/gallery/imagee-2.jpg" },
  { imgUrl: "/images/gallery/imagee-3.jpg" },
];

function MiniSlider() {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div className="my-8 px-14">
      <Carousel>
        <CarouselContent className="-ml-2 md:-ml-4 h-78 my-10">
          {productImages.map((image, index) => {
            return (
              <CarouselItem
                key={index}
                className="relative group lg:basis-1/4 md:basis-1/3 pl-2 lg:pl-4 rounded-lg "
              >
                <div className="relative">
                  <img
                    src={image.imgUrl}
                    className="slider-image"
                    alt="slider"
                  />
                  <div className="slider-content ">
                    <div className="flex items-center justify-start gap-4">
                      {productColor.map((color, index) => {
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-center gap-1 my-2 w-10 h-10 border-[1px] rounded-full border-gray-600"
                          >
                            <div
                              className={`${
                                !isSelected === index
                                  ? "circle"
                                  : "selected-color"
                              } ${color}
                                `}
                              onClick={() => {
                                setIsSelected(index);
                              }}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-gray-200 me-4 flex items-center justify-center">
                      <EuroIcon />
                      39.99
                    </p>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default MiniSlider;
