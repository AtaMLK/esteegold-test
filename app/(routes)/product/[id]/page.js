"use client";

import ItemQuantity from "@/app/_components/ui/item-quantity";
import MiniSlider from "@/app/_components/ui/MiniSlider";
import { useOrderStore } from "@/app/_lib/orderStore";
import { useProductStore } from "@/app/_lib/ProductStore";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { EuroIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../product.css";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/app/_lib/authStore";

const productColor = ["bg-gold", "bg-silver", "bg-roseGold"];

const necklesSizes = [
  { index: 1, options: 40 },
  { index: 2, options: 45 },
];

function ProductId() {
  const [isSelected, setIsSelected] = useState(false);
  const { products, loading, error, fetchProducts } = useProductStore();
  const { setOrder, createOrder, fetchOrders } = useOrderStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (user?.id) {
      createOrder(user.id);
      fetchOrders();
    }
  }, [user]);
  const handleAddToCart = async () => {
    try {
      if (!user?.id) {
        console.error("User not logged in");
        return;
      }

      const order = await createOrder(user.id);
      console.log("Created order:", order);

      await setOrder({
        productId: product.id,
        orderId: order.id,
        quantity: 1,
        unit_price: product.price,
      });
      toast({
        variant: "default",
        description: "Item added to your cart",
      });
    } catch (error) {
      toast({
        variant: "default",
        description: ("Error adding product to order:", error.message),
      });
    }
  };

  const product = products.find((p) => p.id === String(id));
  if (!id) {
    return (
      <p className="flex items-center justify-center w-full text-3xl text-gray-800 h-72">
        Invalid Product ID
      </p>
    );
  }
  if (!product) {
    return (
      <p className=" flex items-center justify-center w-full  text-3xl text-gray-800 h-72">
        product Not Found
      </p>
    );
  }
  const handleChange = (e) => {
    e.preventDefault();
    setIsSelected(e.target.value);
  };

  return (
    <div className="w-full h-full mt-16">
      <div className="dynamic-product-container">
        <div className="product-mainbox">
          <div className="product-left ">
            <div className="slider">
              <Carousel>
                <CarouselContent>
                  {product.product_images?.map((image, index) => {
                    return (
                      <CarouselItem
                        key={index}
                        className="relative w-[150px] h-[500px] lg:w-[200px] lg:h-[700px]"
                      >
                        <Image
                          src={image.image_url}
                          className=""
                          alt="slider"
                          fill
                          objectFit="cover"
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
          <div className="product-right">
            <div className="product-right-details flex flex-col gap-1">
              <h2 className="product-name">{product.name}</h2>
              <p className="mt-2 text-xl">
                {product?.description || "Hand made crafted with love"}
              </p>
              <h3 className="product-price ">
                <EuroIcon className="h-8 w-8" />
                <span className="text-3xl font-normal"> {product?.price}</span>
              </h3>
              <p className=" my-2 text-xl">Available in stock</p>
              <p className=" text-xl">FREE SHIPPING OVER 150 EUROS</p>
              <Link href="/shipping" target="blink">
                <p className="text-blue-800 underline">View More</p>
              </Link>

              <div className="product-material mt-4">
                <h2 className="font-semibold text-[1.25rem] ">Choose Color</h2>
                <div className="flex  items-center justify-start gap-8">
                  {productColor.map((color, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-center gap-2 my-2 w-10 h-10 border-[1px] rounded-full border-gray-600"
                      >
                        <div
                          className={`h-full w-full ${color} ${
                            isSelected === index ? "circle" : "selected-color"
                          }
                        `}
                          onClick={() => {
                            setIsSelected(index);
                          }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="">
                <select
                  name="Select Length"
                  id="options"
                  onChange={handleChange}
                  className="border-[1px] border-gray-700 text-md  h-8 mb-10 rounded-sm "
                >
                  <option>Select Length</option>
                  {necklesSizes.map((option, index) => (
                    <option value={option.options} key={index}>
                      {option.options}
                    </option>
                  ))}
                </select>
              </div>
              <ItemQuantity />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1, scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.5 }}
              >
                <Button
                  variant="outline"
                  className="addtocart-button items-center"
                  onClick={handleAddToCart}
                >
                  Add To Card
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="product-content ">
          <p className="row-start-2 w-full h-full p-16 border-[1px] border-gray-700 text-sm ">
            <strong>Our</strong> jewelry workshop combines artisanal expertise
            with personalization, giving birth to exceptional bespoke pieces. A
            unique customer experience, where exclusivity, authenticity and
            elegance meet. Our jewelry is designed to be worn every day, with a
            focus on quality and durability. We use only the finest materials,
            including ethically sourced diamonds and precious metals. Our
            jewelry is made to last, with a timeless design that will never go
            out of
          </p>
        </div>

        <MiniSlider productImages={product.product_images} />
      </div>
    </div>
  );
}
export default ProductId;
