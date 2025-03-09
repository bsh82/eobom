import Space from "../../../components/common/Space";
import CenterHeader from "../../../components/common/CenterHeader";
import NavBar from "../../../components/common/NavBar";
import { useRecoilValue } from "recoil";
import { userInfoState } from "../../../store/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Home() {
  const userInfo = useRecoilValue(userInfoState);
  const [imageURL, setImageURL] = useState<string>("");
  const [matchingCount, setMatchingCount] = useState<number>(0);
  const [totalMatchingCount, setTotalMatchingCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    getImage(userInfo.profileImage?.data ?? null);
    setTotalMatchingCount(userInfo.manager?.jobOffers?.length);
    setMatchingCount(userInfo.manager?.jobOffers?.filter((offer: any) => { return offer.jobOfferState === "매칭중" }).length);
  }, []);

  const getImage = (image: number[] | null) => {
    if (!image) return;

    const uint8Array = new Uint8Array(image);
    const blob = new Blob([uint8Array], { type: "image/jpeg" });
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageURL(reader.result as string);
    };
    reader.readAsDataURL(blob);
  }

  const handleNavigateSeniorManagement = () => {
    navigate("/seniors");
  }

  return (
    <div className="flex flex-col justify-center font-pre select-none">
      <CenterHeader prev={false} />
      <div className="flex justify-center items-center bg-[#9C9898]">
        <img src="/assets/images/ad.png" />
      </div>
      <div className="flex flex-col justify-center p-[20px]">
        <p className="text-[19px] font-bold">우리 센터 현황</p>
        <Space css="h-[24px]" />
        <div className="flex gap-[16px] items-center">
          <object className="w-[70px]" data="/assets/icons/chart.svg" type="image/svg+xml">
            <img className="w-[70px]" src="/assets/icons/chart.svg" />
          </object>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[#717171] text-[12px]">{userInfo.manager?.centerName}</p>
            <div className="text-[16px] font-medium cursor-pointer" onClick={handleNavigateSeniorManagement}>
              <p className="text-[#FF8411] inline">
                {userInfo?.manager?.jobOffers?.length}명
              </p>의 어르신이<br />
              매칭을 진행하고 있어요
              <img className="inline ml-[8px]" src="/assets/icons/next.svg" />
            </div>
          </div>
        </div>
        <Space css="h-[30px]" />
        <div className="flex border border-[#FAF9F9] p-[20px] justify-around rounded-[10px] shadow-sm">
          <div className="flex flex-col items-center gap-[12px]">
            <p className="text-[12px] text-[#3C3939] font-bold">전체</p>
            <p className="text-[15px] text-[#FF8411] font-extrabold">{totalMatchingCount}</p>
          </div>
          <div className="flex flex-col items-center gap-[12px]">
            <p className="text-[12px] text-[#3C3939] font-bold">매칭 진행 중</p>
            <p className="text-[15px] text-[#FF8411] font-extrabold">{matchingCount}</p>
          </div>
          <div className="flex flex-col items-center gap-[12px]">
            <p className="text-[12px] text-[#3C3939] font-bold">매칭 완료</p>
            <p className="text-[15px] text-[#FF8411] font-extrabold">{totalMatchingCount - matchingCount}</p>
          </div>
        </div>
        <Space css="h-[40px]" />
        <p className="text-[19px] font-bold">내 프로필 관리</p>
        <Space css="h-[24px]" />
        <div className="flex justify-between border border-[#FAF9F9] p-[20px] rounded-[10px] shadow-sm">
          <div className="flex items-center gap-[26px]">
            {
              imageURL === ""
                ? <div className="w-[60px] h-[60px] bg-[#D9D9D9] rounded-full" />
                : <img className="w-[60px] h-[60px] bg-[#D9D9D9] rounded-full" src={imageURL} />
            }
            <div className="flex flex-col">
              <p className="text-[#181818] text-[15px] font-bold">{userInfo.name}</p>
              <p className="text-[#9C9898] text-[12px] font-semibold">{userInfo.manager?.centerName} · {userInfo.userType}</p>
            </div>
          </div>
          <p className="text-[#9C9898] text-[10px] font-medium underline underline-offset-2 cursor-pointer">수정</p>
        </div>
      </div>
      <Space css="h-[12px]" />
      <div className="flex flex-col bg-[#FAF9F9] h-[200px] justify-center p-[30px]">
        <p className="text-[14px] text-[#3C3939] font-semibold">고객센터</p>
        <p className="text-[18px] text-[#3C3939] font-semibold">1234-5678</p>
        <Space css="h-[6px]" />
        <p className="text-[12px] text-[#9C9898] font-medium">운영시간 9시 - 18시 {"( 주말 및 공휴일 휴무, 점심시간 12시 - 13시 )"}</p>
        <Space css="h-[6px]" />
        <div className="flex text-[12px] text-[#9C9898] font-medium">
          <p className="cursor-pointer">서비스 이용 약관</p>
          <p className="pl-[10px] pr-[10px]">|</p>
          <p className="cursor-pointer">문의하기</p>
          <p className="pl-[10px] pr-[10px]">|</p>
          <p className="cursor-pointer">자주 묻는 질문</p>
        </div>
        <Space css="h-[12px]" />
        <p className="text-[14px] text-[#717171] font-bold">{"(주) 얼리어스"}</p>
      </div>
      <NavBar current={0} />
    </div>
  );
}

export default Home;
