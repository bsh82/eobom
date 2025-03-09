import { useEffect, useState } from "react";
import Space from "./Space";

type ButtonProps = {
  text: string,
  onClick: () => void,
  disabled: boolean,
  textButton?: React.JSX.Element | null,
}

const Button = ({ text, onClick, disabled, textButton }: ButtonProps) => {
  const [bottom, setBottom] = useState<number>(0);

  let animationFrameId: number | null = null;

  useEffect(() => {
    const updateBottom = () => {
      if (!window.visualViewport) return;

      const visualViewport = window.visualViewport;

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(() => {
        setBottom(window.innerHeight - visualViewport.height);
      });
    };

    window.visualViewport?.addEventListener("resize", updateBottom);
    window.visualViewport?.addEventListener("scroll", updateBottom);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateBottom);
      window.visualViewport?.removeEventListener("scroll", updateBottom);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="fixed w-full left-[0px] p-[20px] pt-[0px] bg-[#FFFFFF]" style={{ bottom: `${bottom}px` }}>
      {
        textButton
          ? <>
            {textButton}
            <Space css="h-[6px]" />
          </>
          : null
      }
      <button className={`relative w-full min-h-[48px] ${disabled ? "bg-[#D4D2D2] cursor-default" : "bg-[#FF8411] cursor-pointer"} rounded-[10px] text-[19px] text-[#FFFFFF] font-bold`} onClick={disabled ? () => { } : onClick}>
        {text}
      </button>
    </div>
  );
};

export default Button;
