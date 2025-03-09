import CenterHeader from "../../components/common/CenterHeader";
import Space from "../../components/common/Space";
import useAuth from "../../apis/auth";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { userInfoState } from "../../store/store";


function CareMyPage() {
  const userInfo = useRecoilValue(userInfoState);
  const { logout, deleteUser } = useAuth();
  const [imageURL, setImageURL] = useState<string>("");

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
              <label htmlFor='file'>
                <div className="w-[80px] h-[80px] bg-[#FAF9F9] rounded-full cursor-pointer">
                  <img className=" rounded-[30px]" src={imageURL === "" ? "/assets/icons/profile.svg" : imageURL} />
                  <div className="relative top-[-20px] left-[60px] flex justify-center items-center w-[24px] h-[24px] bg-[#FAF9F9] rounded-full shadow-md">
                    <img className="w-[14px]" src="/assets/icons/camera.svg" />
                  </div>
                </div>
              </label>
              <input className="hidden" id="file" type="file" accept="image/*" onChange={handleChangeImage} />
            </div >
            <p className="font-jal text-[18px] font-[#181818]">김누구 보호사</p>
          </div>
          <p className="text-[#9C9898] text-[12px] font-medium underline underline-offset-2 cursor-pointer">내 정보 수정하기</p>
        </div>
      </div>
      <div className="flex flex-col p-[20px] border-b-[2px] border-b-[#FAF9F9]">
        <Space css="h-[12px]" />
        <p className="text-[19px] text-[#181818] font-bold">
          이력서 및 희망근무조건 관리
        </p>
        <Space css="h-[12px]" />
        <div className="w-full border border-[2px] shadow-sm p-[20px] rounded-[10px] border-[#FAF9F9]">
          <div className="flex justify-between">
            <p className="text-[18px] text-[#3C3939] font-bold">{`${userInfo.name} (${userInfo.gender[0]})`}</p>
            <p className="text-[#9C9898] text-[12px] font-medium underline underline-offset-2 cursor-pointer">수정</p>
          </div>
          <Space css="h-[24px]" />
          <div className="flex">
            <img className="w-[24px] mr-[6px]" src="/assets/icons/location-colored.svg" />
            <p className="font-semibold text-[16px] text-[#717171]">{userInfo.caregiver.caregiverAddress}</p>
          </div>
          <Space css="h-[20px]" />
          <div className="flex">
            <img className="w-[24px] mr-[6px]" src="/assets/icons/certification-colored.svg" />
            <p className="font-semibold text-[16px] text-[#717171]">근무 경력 1년 8개월</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-[20px] border-b-[2px] border-b-[#FAF9F9]">
        <p className="text-[19px] text-[#181818] font-bold">
          돌봄 중인 어르신
        </p>
        <Space css="h-[12px]" />
        <div className="flex flex-col gap-[14px]">
          <div className="flex items-center justify-between w-full p-[20px] bg-[#FFFFFF] border border-[2px] border-[#FAF9F9] rounded-[10px] shadow-sm">
            <div className="flex flex-col gap-[14px]">
              <div className="flex items-center">
                <img className="w-[20px] mr-[6px]" src="assets/images/old-man.png" />
                <p className="text-[18px] text-[#3C3939] font-bold">김누구 어르신 {"(만 82세, 남)"}</p>
              </div>
              <p className="text-[16px] text-[#717171] font-semibold">서울시 노원구 공릉동 화랑로 425-13</p>
            </div>
          </div>
          <div className="flex items-center justify-between w-full p-[20px] bg-[#FFFFFF] border border-[2px] border-[#FAF9F9] rounded-[10px] shadow-sm">
            <div className="flex flex-col gap-[14px]">
              <div className="flex items-center">
                <img className="w-[20px] mr-[6px]" src="assets/images/old-man.png" />
                <p className="text-[18px] text-[#3C3939] font-bold">김누구 어르신 {"(만 82세, 남)"}</p>
              </div>
              <p className="text-[16px] text-[#717171] font-semibold">서울시 노원구 공릉동 화랑로 425-13</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center p-[20px] text-[#9C9898] text-[15px] text-center font-semibold">
        <button onClick={handleClickLogout}>로그아웃</button>
        <p className="pl-[10px] pr-[10px]">|</p>
        <button onClick={handleClickWithdrawal}>회원탈퇴</button>
      </div>
    </div >
  );
}

export default CareMyPage;
