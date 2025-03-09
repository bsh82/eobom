import { useRef, useState } from "react";


type ChatMessageProps = {
  text: string,
  me: boolean,
  sentTime: string,
}

const ChatMessage = ({ text, me, sentTime }: ChatMessageProps) => {
  return (
    <>
      {
        me
          ? <div className="w-full flex justify-end items-end gap-[10px]">
            <div className="text-[12px] text-[#676767] font-regular">{sentTime}</div>
            <div className="max-w-[70vw] p-[10px] bg-[#FFF2CC] border border-[#FFAE00] rounded-[10px] rounded-tr-[0px] text-[16px] text-[#3C3939] font-medium">{text}</div>
          </div>
          : <div className="w-full flex justify-start items-end gap-[10px]">
            <div className="max-w-[70vw] p-[10px] bg-[#FAF9F9] border border-[#D4D2D2] rounded-[10px] rounded-tl-[0px] text-[16px] text-[#3C3939] font-medium">{text}</div>
            <div className="text-[12px] text-[#676767] font-regular">{sentTime}</div>
          </div>
      }
    </>
  );
};

export default ChatMessage;
