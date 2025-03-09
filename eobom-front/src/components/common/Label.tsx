type LabelProps = {
  text: string,
}

const Label = ({ text }: LabelProps) => {
  return (
    <label className="text-[20px] font-bold text-[#181818] block">
      {text}
    </label>
  );
};

export default Label;
