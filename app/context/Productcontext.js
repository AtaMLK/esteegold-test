import { supabase } from "../_lib/supabase";

const { useContext, createContext, useState, useEffect } = require("react");

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase.from("products").select(
        `id ,
          name ,
          price ,
          stock,
          material,
          categories (
            id,
            title,
            image_url
          ),
          product_images ( 
            id,
            image_url,
            is_primary
          )
          `
      );
      if (error) {
        console.error("Error fetching images", error);
      } else {
        setProducts(data);
      }
    };

    fetchProduct();
    setLoading(false);
  }, []);
  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductContext);
};
