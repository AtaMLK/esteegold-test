import CircularText from "./CircularText";

function Loading() {
  return (
    <CircularText
      text="REACT*BITS*COMPONENTS*"
      onHover="speedUp"
      spinDuration={20}
      className="custom-class"
    />
  );
}

export default Loading;
