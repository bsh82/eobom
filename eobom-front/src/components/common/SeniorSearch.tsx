import { useRef, useState } from "react";
import Space from "./Space";


type SearchProps = {
  value: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const SeniorSearch = ({ value, onChange }: SearchProps) => {
  const underlines = ["bg-[#D4D2D2]", "bg-[#181818]"];
  const [scrollY, setScrollY] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setScrollY(window.screenY);
  }

  const handleBlur = () => {
    window.scrollTo(0, scrollY);
  }

  return (
    <div className="w-full">
      <div className="flex items-center">
        <img className="mr-[10px]" src="/assets/icons/search.svg" />
        <input ref={inputRef} className="text-[19px] flex-1 font-semibold placeholder-[#9C9898] outline-none" placeholder="어르신 검색" value={value} onChange={onChange} onFocus={handleFocus} onBlur={handleBlur} />
      </div>
      <div className={`w-full h-[2px] ${underlines[value ? 1 : 0]}`} />
    </div>
  );
};

export default SeniorSearch;
