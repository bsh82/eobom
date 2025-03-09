type ButtonProps = {
  icon?: React.JSX.Element | null,
  text: string,
  fontSize?: string,
  width: string,
  height: string,
  onClick: () => void,
  checked: boolean,
}

const CheckButton = ({ icon, text, width, height, onClick, checked, fontSize }: ButtonProps) => {
  return (
    <button className={` ${width} ${height} flex justify-center items-center ${checked ? "bg-[#FFECC4]" : "bg-[#FFFFFF]"} border ${checked ? "border-[#FFAE00]" : "border-[#FAF9F9]"} rounded-full text-[#3C3939] ${checked ? "shadow-sm" : "shadow-xs"} font-bold ${fontSize ? fontSize : "text-[16px]"}`} onClick={onClick}>
      {icon}
      {text}
    </button>
  );
};

export default CheckButton;
