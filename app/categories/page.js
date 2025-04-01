"use client";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Categories & Products</h1>
      {categories.length === 0 ? <p>Loading...</p> : null}
      {categories.map((category) => (
        <div key={category.id} style={{ marginBottom: "20px" }}>
          <h2>{category.name}</h2>
          <ul>
            {category.products.length > 0 ? (
              category.products.map((product) => (
                <li key={product.id}>
                  {product.name} - ${product.price}
                </li>
              ))
            ) : (
              <p>No products available</p>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
