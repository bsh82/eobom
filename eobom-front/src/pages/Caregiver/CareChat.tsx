import { useState } from "react";
import CenterHeader from "../../components/common/CenterHeader";
import ChatInput from "../../components/common/ChatInput";
import ChatMessage from "../../components/common/ChatMessage";


function CareChat() {
  const [text, setText] = useState<string>("");

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }

  return (
    <div className="h-full flex flex-col font-pre select-none">
      <CenterHeader text="김누구 담당자" prev={true} />
      <div>
        <div className="mb-[90px]" />
        <div className="fixed top-[60px] w-full flex justify-between p-[20px] bg-[#FFFFFF] border-b border-b-[#D4D2D2] z-0">
          <div className="flex justify-between items-center gap-[16px]">
            <div className="w-[50px] h-[50px] bg-[#FAF9F9] rounded-full">
              <img src={"/assets/icons/profile.svg"} />
            </div>
            <div className="flex flex-col gap-[6px]">
              <p className="text-[14px] text-[#181818] font-semibold">김누구 어르신 {"(만 82세, 남)"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col h-full justify-end p-[20px] gap-[20px]">
        <div className="flex flex-col gap-[20px] pl-[16px] border-l-[2px] border-[#FF8411]">
          <p className="text-[16px] text-[#181818] font-bold">매칭 조율을 요청했어요</p>
          <p className="text-[14px] text-[#717171] font-semibold">급여, 근무 시간 등 근무 조건 협의를 위해<br />보호사가 매칭 조율을 요청했어요</p>
          <div className="flex items-center text-[14px] text-[#717171] font-semibold">
            <img className="w-[14px] mr-[6px]" src="/assets/images/telephone.png" />
            보호사 연락처 : 010-1234-5678
          </div>
          <button className="max-w-[240px] h-[32px] bg-[#FFF2CC] rounded-[6px] text-[14px] text-[#FF8411] font-bold">매칭 정보 확인</button>
        </div>
        <ChatMessage text="안녕하세요, 담당자님. 근무 시간을 조절할 수 있을까 하여 조율 요청 드립니다." me={false} sentTime="오후 9:32" />
        <ChatMessage text="어떻게 조절 원하시나요?" me={true} sentTime="오후 9:32" />
      </div>
      <ChatInput value={text} onChange={handleChangeTextArea} />
    </div>
  );
}

export default CareChat;
