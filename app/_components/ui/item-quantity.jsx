import { Button } from "@/components/ui/button";
import { useState } from "react";

function ItemQuantity() {
  const [itemValue, setItemValue] = useState(0);

  function handleDeduct() {
    if (itemValue > 0) {
      setItemValue((prevValue) => prevValue - 1);
    }
    console.log(itemValue);
  }
  function handleAdd() {
    setItemValue((prevValue) => prevValue + 1);
    console.log(itemValue);
  }
  return (
    <>
      <div className="add-item-counter flex justify-start">
        <Button
          onClick={handleDeduct}
          variant="outline"
          className="p-3 lg:p-4 border-none lg:border-[1px] border-gray-600 font-bold  text-xl"
        >
          &#8722;
        </Button>

        <input
          type="textarea"
          value={itemValue}
          readOnly
          className="w-10 lg:w-20 h-10 text-center text-gray-900  border-gray-900 outline-none text-sm lg:text-xl"
        />
        <Button
          onClick={handleAdd}
          variant="outline"
          className="p-3 lg:p-4 border-none lg:border-[1px]  border-gray-600 font-bold text-xl"
        >
          +
        </Button>
      </div>
    </>
  );
}

export default ItemQuantity;
