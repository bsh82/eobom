import Space from "../../components/common/Space";
import CenterHeader from "../../components/common/CenterHeader";
import NavBar from "../../components/common/NavBar";
import { useRecoilValue } from "recoil";
import { centerInfoState, userInfoState } from "../../store/store";
import { useEffect, useState } from "react";
import Resume from "../../components/common/Resume";


function CareHome() {
  const userInfo = useRecoilValue(userInfoState);
  // const centerInfo = useRecoilValue(centerInfoState);
  const [imageURL, setImageURL] = useState<string>("");

  useEffect(() => {
    getImage(userInfo.profileImage?.data ?? null);
  }, []);

  const getImage = (image: number[]) => {
    if (!image) return;

    const uint8Array = new Uint8Array(image);
    const blob = new Blob([uint8Array], { type: "image/jpeg" });
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageURL(reader.result as string);
    };
    reader.readAsDataURL(blob);
  }

  return (
    <div className="flex flex-col justify-center font-pre select-none">
      <CenterHeader prev={false} />
      <div className="flex justify-center items-center bg-[#9C9898]">
        <img src="/assets/images/ad.png" />
      </div>
      <div className="flex flex-col justify-center p-[20px]">
        <p className="text-[19px] font-bold">나의 매칭</p>
        <Space css="h-[24px]" />
        <div className="flex gap-[16px] items-center">
          <object className="w-[70px]" data="/assets/icons/matching.svg" type="image/svg+xml">
            <img className="w-[70px]" src="/assets/icons/matching.svg" />
          </object>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[#717171] text-[12px]"></p>
            <div className="text-[16px] font-medium cursor-pointer">
              <p className="text-[#FF8411] inline">
                {2}건
              </p>의 매칭 요청이<br />
              도착했어요
              <img className="inline ml-[8px]" src="/assets/icons/next.svg" />
            </div>
          </div>
        </div>
        <Space css="h-[30px]" />
        <div className="flex border border-[#FAF9F9] p-[20px] justify-around rounded-[10px] shadow-sm">
          <div className="flex flex-col items-center gap-[12px]">
            <p className="text-[12px] text-[#3C3939] font-bold">매칭 요청</p>
            <p className="text-[15px] text-[#FF8411] font-extrabold">1</p>
          </div>
          <div className="flex flex-col items-center gap-[12px]">
            <p className="text-[12px] text-[#3C3939] font-bold">급구 매칭</p>
            <p className="text-[15px] text-[#FF8411] font-extrabold">1</p>
          </div>
        </div>
        <Space css="h-[40px]" />
        <p className="text-[19px] font-bold">이력서 관리</p>
        <Space css="h-[24px]" />
        <Resume name={userInfo?.name} gender={userInfo.gender[0]} address={userInfo.caregiver.caregiverAddress.split("@").join(", ")} experience="1년 8개월" recommended={false} />
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

export default CareHome;
