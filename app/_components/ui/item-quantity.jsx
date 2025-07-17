"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

function ItemQuantity({ initial = 1, onChange }) {
  const [itemValue, setItemValue] = useState(initial);

  //on any changes parent
  useEffect(() => {
    if (onChange) onChange(itemValue);
  }, [itemValue]);

  const handleDeduct = () => {
    setItemValue((prev) => Math.max(prev - 1, 0));
  };

  const handleAdd = () => {
    setItemValue((prev) => prev + 1);
  };

  return (
    <div className="add-item-counter flex justify-start items-center">
      <Button
        onClick={handleDeduct}
        variant="outline"
        className="p-2 lg:p-4 border border-gray-400 font-bold text-xl"
      >
        −
      </Button>

      <input
        type="number"
        value={itemValue}
        readOnly
        className="w-10 lg:w-16 h-10 mx-2 text-center text-gray-900 border border-gray-400 outline-none text-sm lg:text-xl rounded"
      />

      <Button
        onClick={handleAdd}
        variant="outline"
        className="p-2 lg:p-4 border border-gray-400 font-bold text-xl"
      >
        +
      </Button>
    </div>
  );
}

export default ItemQuantity;
