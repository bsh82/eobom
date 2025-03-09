import { useEffect, useRef, useState } from "react";


type ChatInputProps = {
  value: string,
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
}

const ChatInput = ({ value, onChange }: ChatInputProps) => {
  const [marginTop, setMarginTop] = useState<number>(62);
  const [scrollY, setScrollY] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFocus = () => {
    setScrollY(window.screenY);
  }

  const handleBlur = () => {
    window.scrollTo(0, scrollY);
  }

  const handleResizeHeight = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

    setMarginTop(textareaRef.current.scrollHeight + 26);
  }

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    (onChange ?? (() => { }))(e);
    handleResizeHeight();
  }

  return (
    <div>
      <div style={{ marginTop: `${marginTop}px` }} />
      <div className="fixed bottom-[0px] w-full p-[12px] flex items-center gap-[10px] bg-[#FFFFFF] border-t-[2px] border-t-[#FAF9F9]">
        <textarea ref={textareaRef} className="resize-none flex-1 p-[10px] bg-[#FAF9F9] rounded-[17px] shadow-sm text-[16px] font-semibold leading-none overflow-hidden" placeholder="메시지를 입력하세요" rows={1} value={value} onChange={handleChangeTextArea} onFocus={handleFocus} onBlur={handleBlur} />
        <button className={`w-[34px] h-[34px] flex justify-center items-center ${value ? "bg-[#FF8411]" : "bg-[#D4D2D2] cursor-default"} rounded-full shadow-sm`}>
          {
            value
              ? <img src="/assets/icons/send.svg" />
              : <img src="/assets/icons/send-disabled.svg" />
          }
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
