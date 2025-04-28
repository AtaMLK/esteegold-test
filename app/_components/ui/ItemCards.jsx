import Link from "next/link";

function ItemCards({ product }) {
  return (
    <div
      className={`category-items-card col-start-2 col-span-3 grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3  cursor-pointer mx-5 gap-10`}
    >
      {product.map((product, index) => {
        return (
          <Link href={`/product/${product.id}`} key={index}>
            <div
              className={`product-item-card relative  group ${
                index % 2 === 1 ? "md:mt-20" : ""
              }`}
              key={product.id}
            >
              <div className="item-card-image relative">
                <img
                  src={product.product_images?.[0]?.image_url}
                  alt={product.name}
                />
              </div>
              <div className="item-card-hover absolute top-0 left-0  group:hover:opacity-100 z-20 group-hover:h-full">
                <img
                  src={
                    product.product_images?.[1]?.image_url ||
                    product.product_images?.[0]?.image_url
                  }
                  alt={product.name}
                />
                <div className="category-itemscard_content ">
                  <p>{product.name}</p>
                  <p>{product.price}</p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default ItemCards;
