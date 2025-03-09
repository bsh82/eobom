type ExplanationProps = {
  text: string,
}

const Explanation = ({ text }: ExplanationProps) => {
  return (
    <h1 className="text-[15px] font-bold text-[#9C9898]">
      {text}
    </h1>
  );
};

export default Explanation;
