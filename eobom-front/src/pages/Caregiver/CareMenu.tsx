import { useState } from "react";
import CenterHeader from "../../components/common/CenterHeader";
import { useNavigate } from "react-router-dom";


function CareMenu() {
  const [tab, setTab] = useState<number>(0);
  const [chatOn, setChatOn] = useState<boolean>(true);
  const [matchingOn, setMatchingOn] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleNavigateMatching = (index: number) => {
    navigate("/matching", { state: { index: index } });
  }

  const handleNavigateChat = () => {
    navigate("/chats");
  }

  const handleNavigateMypage = () => {
    navigate("/mypage");
  }

  const SubTab = () => {
    switch (tab) {
      default:
      case 0:
        return (
          <div className="bg-[#FFFFFF]">
            <div className="w-full h-[60px] flex flex-col justify-end pl-[24px] pb-[4px] font-jal text-[14px] text-[#717171]">
              매칭 관리
              <div className="relative w-full top-[4px] border-b border-b-[#D4D2D2]" />
            </div>
            <button className="w-full h-[60px] flex items-center p-[24px] border-b-[2px] border-b-[#FAF9F9] text-[16px] text-[#181818] font-bold" onClick={() => handleNavigateMatching(0)}>받은 매칭</button>
            <button className="w-full h-[60px] flex items-center p-[24px] border-b-[2px] border-b-[#FAF9F9] text-[16px] text-[#181818] font-bold" onClick={() => handleNavigateMatching(1)}>급구 매칭</button>
            <button className="w-full h-[60px] flex justify-between items-center p-[24px] border-b-[2px] border-b-[#FAF9F9] text-[16px] text-[#181818] font-bold" onClick={() => setMatchingOn(prev => !prev)}>
              매칭 받기 설정
              <div className={`w-[48px] h-[24px] flex justify-center items-center gap-[6px] p-[2px] ${matchingOn ? "pl-[8px] bg-[#FFF2CC]" : "pr-[8px] bg-[#FFFFFF]"} rounded-full shadow-sm`}>
                {
                  matchingOn
                    ? <>
                      <p className="text-[14px] text-[#FF8411] font-bold">켬</p>
                      <div className="w-[18px] h-[18px] rounded-full bg-[#FFAE00]" />
                    </>
                    : <>
                      <div className="w-[18px] h-[18px] rounded-full bg-[#9C9898]" />
                      <p className="text-[14px] text-[#3C3939] font-bold">끔</p>
                    </>
                }
              </div>
            </button>
          </div>
        );
      case 1:
        return (
          <div className="bg-[#FFFFFF]">
            <div className="w-full h-[60px] flex flex-col justify-end pl-[24px] pb-[4px] font-jal text-[14px] text-[#717171]">
              채팅
              <div className="relative w-full top-[4px] border-b border-b-[#D4D2D2]" />
            </div>
            <button className="w-full h-[60px] flex items-center p-[24px] border-b-[2px] border-b-[#FAF9F9] text-[16px] text-[#181818] font-bold" onClick={handleNavigateChat}>채팅 목록</button>
            <button className="w-full h-[60px] flex justify-between items-center p-[24px] border-b-[2px] border-b-[#FAF9F9] text-[16px] text-[#181818] font-bold" onClick={() => setChatOn(prev => !prev)}>
              채팅 알림
              <button className={`w-[48px] h-[24px] flex justify-center items-center gap-[6px] p-[2px] ${chatOn ? "pl-[8px] bg-[#FFF2CC]" : "pr-[8px] bg-[#FFFFFF]"} rounded-full shadow-sm`}>
                {
                  chatOn
                    ? <>
                      <p className="text-[14px] text-[#FF8411] font-bold">켬</p>
                      <div className="w-[18px] h-[18px] rounded-full bg-[#FFAE00]" />
                    </>
                    : <>
                      <div className="w-[18px] h-[18px] rounded-full bg-[#9C9898]" />
                      <p className="text-[14px] text-[#3C3939] font-bold">끔</p>
                    </>
                }
              </button>
            </button>
          </div>
        );
      case 2:
        return (
          <div className="bg-[#FFFFFF]">
            <div className="w-full h-[60px] flex flex-col justify-end pl-[24px] pb-[4px] font-jal text-[14px] text-[#717171]">
              마이페이지
              <div className="relative w-full top-[4px] border-b border-b-[#D4D2D2]" />
            </div>
            <button className="w-full h-[60px] flex items-center p-[24px] border-b-[2px] border-b-[#FAF9F9] text-[16px] text-[#181818] font-bold">내 정보 수정</button>
            <button className="w-full h-[60px] flex items-center p-[24px] border-b-[2px] border-b-[#FAF9F9] text-[16px] text-[#181818] font-bold">이력서 관리</button>
            <button className="w-full h-[60px] flex items-center p-[24px] border-b-[2px] border-b-[#FAF9F9] text-[16px] text-[#181818] font-bold">돌봄 중인 어르신</button>
          </div>
        );
    }
  }

  return (
    <div className="h-full flex flex-col font-pre select-none">
      <CenterHeader text="메뉴" prev={true} />
      <div className="flex h-full bg-[#FAF9F9]">
        <div className="w-[40vh] flex flex-col">
          <button className={`h-[60px] flex justify-center items-center ${tab === 0 ? "bg-[#FFFFFF] text-[#181818] font-bold" : "text-[#3C3939] font-semibold"}`} onClick={() => setTab(0)}>매칭 관리</button>
          <button className={`h-[60px] flex justify-center items-center ${tab === 1 ? "bg-[#FFFFFF] text-[#181818] font-bold" : "text-[#3C3939] font-semibold"}`} onClick={() => setTab(1)}>채팅</button>
          <button className={`h-[60px] flex justify-center items-center ${tab === 2 ? "bg-[#FFFFFF] text-[#181818] font-bold" : "text-[#3C3939] font-semibold"}`} onClick={() => setTab(2)}>마이페이지</button>
        </div>
        <div className="flex w-[60vh] flex-col">
          {SubTab()}
        </div>
      </div>
    </div>
  );
}

export default CareMenu;
