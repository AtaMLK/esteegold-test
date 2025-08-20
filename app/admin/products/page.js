import { Button } from "@/components/ui/button";
import Link from "next/link";

function AdminProductsPage() {
  return (
    <div className="flex gap-20 items-center justify-between px-10 w-full">
      <div className="w-1/2 px-4 py-5 border rounded-lg flex flex-col gap-8 items-start justify-center">
        <h1 className="text-2xl font-bold text-green-900">
          Create a New Product
        </h1>
        <p className="text-sm text-stone-600">
          Add your latest products to your store and keep your catalog up to
          date.
        </p>

        <Button
          variant="outline"
          className="border-green-700 text-green-800 hover:bg-lightgreen-500 hover:text-green-900"
        >
          <Link href="/admin/products/addnewproduct">Add new Product</Link>
        </Button>
      </div>
      <div className="w-1/2 px-4 py-5 border rounded-lg flex flex-col gap-8 items-start justify-center">
        <h1 className="text-2xl font-bold text-green-900">
          Manage Existing Products
        </h1>
        <p className="text-sm text-stone-600">
          Update product details, pricing, and availability — all in one place.
        </p>

        <Button
          variant="outline"
          className="border-green-700 text-green-800 hover:bg-lightgreen-500 hover:text-green-900"
        >
          <Link href="/admin/products/editProducts">Start editing</Link>
        </Button>
      </div>
    </div>
  );
}

export default AdminProductsPage;
