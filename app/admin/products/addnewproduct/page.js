"use client";


import AddFormComponent from "@/app/_components/ui/AddFormComponent";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddProductsPage() {
  const router = useRouter();

  return (
    <div className="relative rounded shadow bg-stone-50 w-full h-min py-10">
      <button
        onClick={() => router.back()}
        className="absolute text-stone-600 p-5 top-0 left-5 rounded hover:bg-blue-900/20 bg-blue-900/10 mt-5 shadow cursor-pointer"
      >
        <ArrowLeft className="hover:scale-125 transtion-all duration-200" />
      </button>
      <h1 className="text-2xl font-bold text-blue-900 py-10 text-center">
        Add New Product
      </h1>
      <AddFormComponent />
    </div>
  );
}
