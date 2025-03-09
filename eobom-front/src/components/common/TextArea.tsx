import { useRef, useState } from "react";
import Space from "./Space";

type TextAreaProps = {
  placeholder: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  maxLength: number,
  rows: number,
}

const TextArea = ({ value, placeholder, onChange, maxLength, rows }: TextAreaProps) => {
  const [scrollY, setScrollY] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFocus = () => {
    setScrollY(window.screenY);
  }

  const handleBlur = () => {
    window.scrollTo(0, scrollY);
  }

  return (
    <div className="flex flex-col items-end">
      <textarea ref={textareaRef} className="resize-none w-full text-[19px] font-semibold border-[2px] focus:outline-[1px] rounded-[6px] p-[10px]" placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength} rows={rows} onFocus={handleFocus} onBlur={handleBlur} />
      <Space css="h-[10px]" />
      <p className="text-[13px] text-[#9C9898] mr-[6px] font-medium">{`${value.length} / ${maxLength}`}</p>
    </div>
  );
};

export default TextArea;
