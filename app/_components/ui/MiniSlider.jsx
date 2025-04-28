import { useProducts } from "@/app/context/Productcontext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EuroIcon } from "lucide-react";
import Spinner from "./Spinner";
import Link from "next/link";

const productColor = ["gold", "silver"];

function MiniSlider() {
  const { products, loading } = useProducts();

  if (loading) return <Spinner />;
  let allImages = [];

  products.forEach((product) => {
    if (product.product_images && product.product_images.length > 0) {
      product.product_images.forEach((img) => {
        allImages.push({
          imageUrl: img.image_url,
          price: product.price,
          productId: product.id,
          primary: img.is_primary,
        });
      });
    }
  });

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  const shuffleImages = shuffleArray(allImages);
  return (
    <div className="my-8 px-14">
      <Carousel>
        <CarouselContent className="-ml-2 md:-ml-4 h-78 my-10">
          {shuffleImages
            .filter((imgObj) => imgObj.primary)
            .map((imgObj) => {
              return (
                <CarouselItem
                  key={imgObj.productId}
                  className="relative group lg:basis-1/4 md:basis-1/3 pl-2 lg:pl-4 rounded-lg hover:cursor-pointer"
                >
                  <Link href={`/product/${imgObj.productId}`}>
                    <div className="relative">
                      <img
                        src={imgObj.imageUrl}
                        className="slider-image"
                        alt="slider"
                      />
                      <div className="slider-content ">
                        <div className="flex items-center justify-start gap-4 circle"></div>
                        <p className="text-gray-200 me-4 flex items-center justify-center">
                          <EuroIcon />
                          {imgObj.price}
                        </p>
                      </div>
                    </div>
                  </Link>
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
