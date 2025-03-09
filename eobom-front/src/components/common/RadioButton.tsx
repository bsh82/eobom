type ButtonProps = {
  text: string,
  onClick: () => void,
  checked: boolean,
}

const RadioButton = ({ text, onClick, checked }: ButtonProps) => {
  return (
    <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#3C3939]`} onClick={onClick}>
      <div className="flex justify-center items-center w-[20px] h-[20px] rounded-[50%] shadow-sm border border-[#D4D2D2] mr-[8px]">
        {
          checked
            ? <div className="w-[10px] h-[10px] rounded-[50%] bg-[#FF8411]" />
            : null
        }

      </div>
      {text}
    </div>
  );
};

export default RadioButton;
