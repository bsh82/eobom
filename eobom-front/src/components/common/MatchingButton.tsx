import { useEffect, useState } from "react";
import Space from "./Space";

type ButtonProps = {
  onClickAccept: () => void,
  onClickCoordinate: () => void,
  onClickRefuse: () => void,
}

const MatchingButton = ({ onClickAccept, onClickCoordinate, onClickRefuse }: ButtonProps) => {
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
    <div>
      <div className="h-[148px]" />
      <div className="fixed w-full flex flex-col left-[0px] p-[20px] bg-[#FFFFFF] gap-[12px]" style={{ bottom: `${bottom}px` }}>
        <button className={`relative w-full min-h-[48px] bg-[#FF8411] rounded-[10px] text-[19px] text-[#FFFFFF] font-bold`} onClick={onClickAccept}>
          매칭 수락
        </button>
        <div className="flex gap-[12px]">
          <button className={`relative w-full min-h-[48px] border border-[#FAF9F9] bg-[#FFFFFF] rounded-[10px] text-[19px] text-[#3C3939] font-bold shadow-sm`} onClick={onClickCoordinate}>
            조율 요청
          </button>
          <button className={`relative w-full min-h-[48px] border border-[#FAF9F9] bg-[#FFFFFF] rounded-[10px] text-[19px] text-[#3C3939] font-bold shadow-sm`} onClick={onClickRefuse}>
            매칭 거절
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchingButton;
