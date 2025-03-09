import { useNavigate } from "react-router-dom";
import CenterHeader from "../../components/common/CenterHeader";
import NavBar from "../../components/common/NavBar";


function CareChatList() {
  const navigate = useNavigate();

  const handleNavigateChatDetail = () => {
    navigate("/chats/detail");
  }

  return (
    <div className="h-full flex flex-col font-pre select-none">
      <CenterHeader text="채팅" prev={false} />
      {/* <div className="h-full flex justify-center">
        <div className="flex flex-col justify-center items-center gap-[20px] text-[20px] text-[#9C9898] font-bold">
          <img src="/assets/icons/speech-balloon.svg" />
          아직 채팅 내역이 없어요
        </div>
      </div> */}
      <button className="flex justify-between p-[20px] border-b border-b-[#D4D2D2]" onClick={handleNavigateChatDetail}>
        <div className=" flex justify-between items-center gap-[16px]">
          <div className="w-[50px] h-[50px] bg-[#FAF9F9] rounded-full">
            <img src={"/assets/icons/profile.svg"} />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-[15px] text-[#181818] font-bold">김누구 담당자</p>
            <p className="text-[10px] text-[#717171] font-semibold">김누구 어르신 {"(이어봄방문요양센터)"}</p>
            <p className="text-[13px] text-[#181818] font-semibold">문자 내용</p>
            <p className="text-[13px] text-[#2e2d2d] font-semibold">문자 내용</p>
          </div>
        </div>
        <p className="text-[10px] text-[#9C9898] font-semibold">오전 09:00</p>
      </button>
      <button className="flex justify-between p-[20px] border-b border-b-[#D4D2D2]" onClick={handleNavigateChatDetail}>
        <div className=" flex justify-between items-center gap-[16px]">
          <div className="w-[50px] h-[50px] bg-[#FAF9F9] rounded-full">
            <img src={"/assets/icons/profile.svg"} />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-[15px] text-[#181818] font-bold">김누구 담당자</p>
            <p className="text-[10px] text-[#717171] font-semibold">김누구 어르신 {"(이어봄방문요양센터)"}</p>
            <p className="text-[13px] text-[#181818] font-semibold">문자 내용</p>
            <p className="text-[13px] text-[#181818] font-semibold">문자 내용</p>
          </div>
        </div>
        <p className="text-[10px] text-[#9C9898] font-semibold">오전 09:00</p>
      </button>
      <NavBar current={2} />
    </div>
  );
}

export default CareChatList;
