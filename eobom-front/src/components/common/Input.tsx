import { useRef, useState } from "react";
import Space from "./Space";

type InputProps = {
  type: string,
  label?: string,
  placeholder: string,
  value: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onClick?: () => void,
  prefix?: React.JSX.Element | null,
  suffix?: React.JSX.Element | null,
}

const Input = ({ type, label, placeholder, value, onChange, onClick, prefix, suffix }: InputProps) => {
  const underlines = ["bg-[#D4D2D2]", "bg-[#181818]"];
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setScrollY(window.screenY);
  }

  const handleBlur = () => {
    window.scrollTo(0, scrollY);
  }

  const BodyComponent = () => {
    switch (type) {
      case "id":
        return (
          <input ref={inputRef} className="text-[19px] flex-1 font-semibold placeholder-[#9C9898] outline-none" placeholder={placeholder} value={value} onChange={onChange} onFocus={handleFocus} onBlur={handleBlur} />
        );
      case "password":
        return (
          <>
            <input ref={inputRef} className="text-[19px] flex-1 font-semibold placeholder-[#9C9898] outline-none" placeholder={placeholder} value={value} onChange={onChange} type={passwordVisible ? "text" : "password"} onFocus={handleFocus} onBlur={handleBlur} />
            <button onClick={() => setPasswordVisible(!passwordVisible)}>
              <img src={`/assets/icons/${passwordVisible ? "eye-open" : "eye-close"}.svg`} />
            </button>
          </>
        );
      case "text":
        return (
          <input ref={inputRef} className="text-[19px] flex-1 font-semibold placeholder-[#9C9898] outline-none" placeholder={placeholder} value={value} onChange={onChange} onFocus={handleFocus} onBlur={handleBlur} />
        );
      case "date":
      case "tel":
        return (
          <input ref={inputRef} className={`${type === "date" ? placeholder === "YY.MM" ? "w-[60px]" : "w-[80px]" : "w-full"} text-[19px] flex-1 font-semibold placeholder-[#9C9898] outline-none`} placeholder={placeholder} value={value} onChange={onChange} type="tel" onFocus={handleFocus} onBlur={handleBlur} />
        );
      default:
        return (
          <input ref={inputRef} className="text-[19px] flex-1 font-semibold placeholder-[#9C9898] outline-none" placeholder={placeholder} value={value} onChange={onChange} onFocus={handleFocus} onBlur={handleBlur} />
        );
    }
  }

  return (
    <label className="text-[20px] font-bold text-[#181818]" onClick={onClick ?? (() => { })}>
      {
        label ?
          <>{label}<br />
            <Space css="h-[20px]" /></>
          : null
      }
      <div className="flex">
        {prefix ?? null}
        {BodyComponent()}
        {suffix ?? null}
      </div>
      <div className={`${type === "date" ? placeholder === "YY.MM" ? "w-[100px]" : "w-[126px]" : "w-full"} h-[2px] ${underlines[value ? 1 : 0]}`} />
    </label>
  );
};

export default Input;
