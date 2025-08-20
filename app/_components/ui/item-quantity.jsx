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
        className="w-8 h-8 p-1 border border-gray-400 font-bold text-md"
      >
        −
      </Button>

      <input
        type="number"
        value={itemValue}
        readOnly
        className="w-8 h-8 mx-2 outline-none border border-gray-400 rounded text-center "
      />

      <Button
        onClick={handleAdd}
        variant="outline"
        className="w-8 h-8 p-1 border border-gray-400 font-bold text-md "
      >
        +
      </Button>
    </div>
  );
}

export default ItemQuantity;
