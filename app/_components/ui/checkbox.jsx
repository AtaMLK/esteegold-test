import { useState } from "react";
function Checkbox() {
  const [checked, setChecked] = useState(false);
  return (
    <label className="flex items-center space-x-2 justify-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="hidden peer"
        
      />
      <div
        className="w-6 h-6 flex items-center justify-center  rounded-full m-2 bg-gray-200 mx-auto
                     peer-checked:bg-gray-600 peer-checked:text-gray-200 "
      >
        {checked && <span className="text-white">✔</span>}
      </div>
    </label>
  );
}

export default Checkbox;
