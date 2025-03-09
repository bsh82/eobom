type BoxProps = {
  text: string,
  onClick: () => void,
  checked: boolean,
  prefix?: React.JSX.Element | null,
}

const CheckBox = ({ text, onClick, checked, prefix }: BoxProps) => {
  return (
    <button className={`flex items-center p-[20px] w-full h-[60px] ${checked ? "bg-[#FFECC4]" : "bg-[#FFFFFF]"} border ${checked ? "border-[#FFAE00]" : "border-[#FAF9F9]"} rounded-[10px] text-[#3C3939] ${checked ? "shadow-sm" : "shadow-xs"} font-bold text-[18px]`} onClick={onClick}>
      <div className="flex items-center flex-1">
        {prefix ?? null}
        {text}
      </div>
      {
        checked
          ? <img src="/assets/icons/check-colored.svg" />
          : <img src="/assets/icons/check.svg" />
      }
    </button>
  );
};

export default CheckBox;
