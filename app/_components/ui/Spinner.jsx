import { PuffLoader } from "react-spinners";

function Spinner() {
  return (
    <div className="w-full h-[30rem] flex items-center justify-center">
      <PuffLoader />
    </div>
  );
}

export default Spinner;
