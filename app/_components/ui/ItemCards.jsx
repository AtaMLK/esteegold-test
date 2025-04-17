function ItemCards({ categories, gap }) {
  return (
    <div
      className={`category-items-card col-start-2 col-span-3 grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3  cursor-pointer mx-5 gap-${gap}`}
    >
      {categories.map((category, index) => {
        return (
          <div
            className={`item-card relative group ${
              index % 2 === 1 ? "md:mt-20" : ""
            }`}
            key={category.id}
          >
            <img
              src={category.src}
              alt={category.title}
              className="w-full h-[36rem]"
            />
            <div
              className={`w-full h-0 overflow-hidden group group-hover:h-full absolute bottom-0 left-0 group-hover:top-0 transition-all duration-500 `}
            >
              <img
                src={category.src2}
                alt={category.title}
                className="w-full h-full "
              />
              <div className="category-items-card_content ">
                <p>{category.title}</p>
                <p>{category.price}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ItemCards;
