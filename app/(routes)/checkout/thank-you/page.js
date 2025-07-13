"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import Link from "next/link";

export default function ThankYou() {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiSize, setConfettiSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    setConfettiSize({ width: window.innerWidth, height: window.innerHeight });
    
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-br from-gray-400 to-darkgreen-300 text-gray-800 p-6">
      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti width={confettiSize.width} height={confettiSize.height} numberOfPieces={600} />
      )}

      {/* Thank You Message */}
      <h1 className="text-5xl font-bold mb-4 animate-pulse text-center">
         Thank You for Your Purchase! 
      </h1>
      <p className="text-lg mb-6 text-center max-w-lg">
        Your order has been successfully placed. We appreciate your support!
      </p>

      {/* Return to Home Button */}
      <Link
        href="/"
        className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-green-800 transition"
      >
        Return to Home
      </Link>
    </div>
  );
}
