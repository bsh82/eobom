import CenterHeader from "../../../components/common/CenterHeader";
import Space from "../../../components/common/Space";
import useAuth from "../../../apis/auth";
import { useRecoilValue } from "recoil";
import { userInfoState } from "../../../store/store";
import { useEffect, useState } from "react";


function MyPage() {
  const { logout, deleteUser } = useAuth();
  const userInfo = useRecoilValue(userInfoState);
  const [matchingCount, setMatchingCount] = useState<number>(0);
  const [totalMatchingCount, setTotalMatchingCount] = useState<number>(0);
  const [imageURL, setImageURL] = useState<string>("");

  useEffect(() => {
    setTotalMatchingCount(userInfo.manager?.jobOffers?.length);
    setMatchingCount(userInfo.manager?.jobOffers?.filter((offer: any) => { return offer.jobOfferState === "매칭중" }).length);
  }, []);


  const handleClickLogout = () => {
    logout();
  }

  const handleClickWithdrawal = () => {
    deleteUser();
  }

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    context.imageSmoothingEnabled = true;
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = async () => {
      const imageSize = image.width < image.height ? image.width : image.height;
      const canvasSize = imageSize > 360 ? 360 : imageSize;

      canvas.width = canvasSize;
      canvas.height = canvasSize;

      context.drawImage(image, (image.width - imageSize) / 2, (image.height - imageSize) / 2, imageSize, imageSize, 0, 0, canvasSize, canvasSize);
      const dataURL = canvas.toDataURL("image/jpeg");

      if (!dataURL) return;

      setImageURL(dataURL);

      canvas.toBlob((blob) => {
        if (blob) {
          // onChange(dataURL, blob);
        }
      }, "image/jpeg");
    };
  }

  return (
    <div className="h-full flex flex-col font-pre select-none">
      <CenterHeader text="마이페이지" prev={true} />
      <div className="flex flex-col p-[20px] border-b-[2px] border-b-[#FAF9F9]">
        <div className="flex justify-between">
          <div className="flex items-center gap-[20px]">
            <div className="flex justify-center">
              {/* <label htmlFor='file'> */}
              <div className="w-[80px] h-[80px] bg-[#FAF9F9] rounded-full cursor-pointer">
                <img className=" rounded-[30px]" src={imageURL === "" ? "/assets/icons/profile.svg" : imageURL} />
                {/* <div className="relative top-[-20px] left-[60px] flex justify-center items-center w-[24px] h-[24px] bg-[#FAF9F9] rounded-full shadow-md">
                    <img className="w-[14px]" src="/assets/icons/camera.svg" />
                  </div> */}
              </div>
              {/* </label> */}
              {/* <input className="hidden" id="file" type="file" accept="image/*" onChange={handleChangeImage} /> */}
            </div >
            <div className="flex flex-col">
              <p className="font-jal text-[18px] font-[#181818]">{userInfo.name}</p>
              <p className="text-[12px] text-[#9C9898]">{userInfo.manager?.centerName}</p>
            </div>
          </div>
          <p className="text-[12px] text-[#9C9898] font-medium underline underline-offset-2 cursor-pointer">내 정보 수정하기</p>
        </div>
      </div>
      <div className="flex flex-col p-[20px] border-b-[2px] border-b-[#FAF9F9]">
        <p className="text-[19px] text-[#181818] font-bold">
          센터 정보
        </p>
        <Space css="h-[12px]" />
        <div className="w-full border border-[2px] shadow-sm p-[20px] rounded-[10px] border-[#FAF9F9]">
          <div className="flex justify-between">
            <p className="text-[18px] text-[#3C3939] font-bold">{userInfo.manager?.centerName}</p>
            <p className="text-[#9C9898] text-[12px] font-medium underline underline-offset-2 cursor-pointer">수정</p>
          </div>
          <Space css="h-[24px]" />
          <div className="flex">
            <img className="w-[24px] mr-[6px]" src="/assets/icons/location-disabled.svg" />
            <p className="font-semibold text-[16px] text-[#717171]">{userInfo.manager?.centerAddress}</p>
          </div>
          <Space css="h-[20px]" />
          <div className="flex">
            <img className="w-[24px] mr-[6px]" src="/assets/icons/certification-disabled.svg" />
            <p className="font-semibold text-[16px] text-[#717171]">{userInfo.manager?.centerGrade}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-[20px] border-b-[2px] border-b-[#FAF9F9]">
        <p className="text-[19px] text-[#181818] font-bold">
          우리 센터 어르신 현황
        </p>
        <Space css="h-[12px]" />
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
      </div>
      {/* <div className="flex flex-col p-[20px]">
        <p className="text-[19px] text-[#181818] font-bold">
          우리 센터 매칭 수락률
        </p>
        <Space css="h-[8px]" />
        <p className="text-[36px] text-[#FF8411] font-black">{(totalMatchingCount - matchingCount) / totalMatchingCount}%</p>
        <Space css="h-[6px]" />
        <div className="bg-[#D4D2D2] w-full h-[30px] rounded-full">
          <div className="bg-[#FFAE00] h-[30px] rounded-full" style={{ width: `${(window.innerWidth - 40) * 7 / 10}px` }} />
        </div>
        <div className="flex justify-between pl-[20px] pr-[20px] p-[4px] text-[12px] text-[#717171] font-bold">
          <p>수락 70건</p>
          <p>거절 30건</p>
        </div>
      </div> */}
      <div className="flex justify-center p-[20px] text-[#9C9898] text-[15px] text-center font-semibold">
        <button onClick={handleClickLogout}>로그아웃</button>
        <p className="pl-[10px] pr-[10px]">|</p>
        <button onClick={handleClickWithdrawal}>회원탈퇴</button>
      </div>
    </div >
  );
}

export default MyPage;
