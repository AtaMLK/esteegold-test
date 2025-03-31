import { Check } from "lucide-react";
import { useState } from "react";
function Checkbox({check}) {
  const [checked, setChecked] = useState(false);
  return (
    <label className="flex items-center space-x-2 justify-center cursor-pointer">
      <input
        type="checkbox"
        onChange={() => setChecked(!checked)}
        checked={check} 
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
