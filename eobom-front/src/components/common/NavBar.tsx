import { useNavigate } from "react-router-dom";
import Space from "./Space";
import { useRecoilValue } from "recoil";
import { userTypeState } from "../../store/store";
import useAuth from "../../apis/auth";


type NavBarProps = {
  current?: number,
}

const NavBar = ({ current }: NavBarProps) => {
  const { getUserType } = useAuth();
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/");
  }

  const handleNavigateSeniorManagement = () => {
    navigate("/seniors");
  }

  const handleNavigateChat = () => {
    navigate("/chats");
  }

  const handleNavigateMypage = () => {
    navigate("/mypage");
  }

  const handleNavigateMatching = () => {
    navigate("/matching");
  }

  return (
    <div className="flex flex-col">
      <div className="mt-[79px]" />
      <div className="fixed bottom-[0px] bg-[#FFFFFF] font-pre flex justify-center w-full h-[80px] p-[16px] pb-[10px] border-t-[1px] border-[#D4D2D2]">
        <button className="flex flex-col items-center gap-[4px] w-[50px] h-[50px]" onClick={handleNavigateHome}>
          <img src={`/assets/icons/home${current === 0 ? "-colored" : ""}.svg`} />
          <p className={`text-[10px] ${current === 0 ? "text-[#FF8411]" : "text-[#3C3939]"} font-semibold`}>홈</p>
        </button>
        <Space css="w-[40px]" />
        <button className="flex flex-col items-center gap-[4px] w-[50px] h-[50px]" onClick={getUserType() === 1 ? handleNavigateMatching : handleNavigateSeniorManagement}>
          <img src={`/assets/icons/${getUserType() === 1 ? "target" : "stats"}${current === 1 ? "-colored" : ""}.svg`} />
          <p className={`text-[10px] ${current === 1 ? "text-[#FF8411]" : "text-[#3C3939]"} font-semibold`}>{getUserType() === 1 ? "나의 매칭" : "어르신 관리"}</p>
        </button>
        <Space css="w-[40px]" />
        <button className="flex flex-col items-center gap-[4px] w-[50px] h-[50px]" onClick={handleNavigateChat}>
          <img src={`/assets/icons/chat${current === 2 ? "-colored" : ""}.svg`} />
          <p className={`text-[10px] ${current === 2 ? "text-[#FF8411]" : "text-[#3C3939]"} font-semibold`}>채팅</p>
        </button>
        <Space css="w-[40px]" />
        <button className="flex flex-col items-center gap-[4px] w-[50px] h-[50px]" onClick={handleNavigateMypage}>
          <img src="/assets/icons/person.svg" />
          <p className="text-[10px] text-[#3C3939] font-semibold">마이페이지</p>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
