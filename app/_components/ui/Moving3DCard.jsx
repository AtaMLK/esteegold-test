"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { z } from "zod";

export const PaymentSchema = z.object({
  cardName: z
    .string()
    .min(3, { message: "Cardholder name must be at least 3 characters" }),
  cardNumber: z
    .string()
    .regex(/^[0-9]{16}$/, { message: "Card number must be 16 digits" }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, {
    message: "Expiry date must be MM/YY",
  }),
  cvv: z
    .string()
    .regex(/^[0-9]{3,4}$/, { message: "CVV must be 3 or 4 digits" }),
});

const BankCard = () => {
  const cardRef = useRef(null);
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    const card = cardRef.current;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (clientX - left - width / 2) / 10;
      const y = (clientY - top - height / 2) / 10;

      gsap.to(card, {
        rotationY: x,
        rotationX: -y,
        duration: 0.3,
        ease: "power1.out",
        boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.5)",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: "power2.out",
        boxShadow: "none",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      ref={cardRef}
      className="w-[30rem] h-[18rem] bg-gradient-to-br from-gray-900 to-gray-700 bg-opacity-80 rounded-xl p-6 text-white shadow-xl relative backdrop-blur-md scale-100 border border-white/30"
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
    >
      <div className="absolute top-4 right-4 text-2xl font-bold glow-text">
        💳
      </div>
      <div className="mt-8 text-xl font-semibold tracking-widest">
        {formData.cardNumber || "•••• •••• •••• ••••"}
      </div>
      <div className="mt-4 flex justify-between">
        <span className="text-sm">{formData.cardName || "CARDHOLDER"}</span>
      </div>
      <div className="absolute top-12 right-4 text-lg">
        CVV: {formData.cvv || "•••"}
      </div>
      <form className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
        <input
          type="text"
          name="cardName"
          value={formData.cardName}
          onChange={handleChange}
          placeholder="Enter Name"
          className="p-2 rounded bg-white bg-opacity-20 outline-none focus:ring-2 focus:ring-white transition-all"
        />
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="Enter Card Number"
          className="p-2 rounded bg-white bg-opacity-20 outline-none focus:ring-2 focus:ring-white transition-all"
        />
        <div className="flex gap-2">
          <input
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            className="p-2 w-1/2 rounded bg-white bg-opacity-20 outline-none focus:ring-2 focus:ring-white transition-all"
          />
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="CVV"
            className="p-2 w-1/2 rounded bg-white bg-opacity-20 outline-none focus:ring-2 focus:ring-white transition-all"
          />
        </div>
      </form>
    </div>
  );
};

export default BankCard;
