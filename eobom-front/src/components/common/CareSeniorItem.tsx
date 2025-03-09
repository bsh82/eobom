import { useNavigate } from "react-router-dom";
import MatchingState from "./MatchingState";
import Space from "./Space";

type ItemProps = {
  senior?: SeniorProps
  state?: number,
}

type SeniorProps = {
  seniorId: string,
  seniorName: string,
  seniorAddress: string,
  seniorBirth: string,
  seniorGender: string,
  seniorGrade: string,
}

const getAge = (birthday: string) => {
  const birth = new Date(birthday.replace(/[^0-9]/g, "").replace(/^(\d{2})(\d{2})(\d{2})$/, "19$1-$2-$3"));
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    return age - 1;
  }
  return age;
}

const CareSeniorItem = ({ senior, state }: ItemProps) => {
  const navigate = useNavigate();

  const handleClickItem = () => {
    navigate("/jobs/1")
  }

  switch (state) {
    default:
    case 0:
      return (
        <button className="flex flex-col w-full p-[20px] border border-[2px] border-[#FAF9F9] gap-[14px] rounded-[10px] shadow-sm" onClick={handleClickItem}>
          <div className="flex items-center">
            <img className="w-[20px] mr-[6px]" src="assets/images/old-man.png" />
            <p className="text-[18px] text-[#3C3939] font-bold">김누구 어르신 </p>
          </div>
          <p className="text-[15px] text-[#9C9898] font-semibold">식사보조, 배변보조, 이동보조</p>
          <div className="flex flex-col gap-[6px]">
            <div className="flex gap-[20px]">
              <p className="text-[16px] text-[#181818] font-bold">일정</p>
              <p className="text-[16px] text-[#717171] font-semibold">매주 2회 / 월, 수 / 2시간</p>
            </div>
            <div className="flex gap-[20px]">
              <p className="text-[16px] text-[#181818] font-bold">기간</p>
              <p className="text-[16px] text-[#717171] font-semibold">25.02.18 ~ 25.08.18</p>
            </div>
            <div className="flex gap-[20px]">
              <p className="text-[16px] text-[#181818] font-bold">위치</p>
              <p className="text-[16px] text-[#717171] font-semibold">서울 노원구 공릉동 화랑로 425-13</p>
            </div>
            <div className="flex gap-[20px]">
              <p className="text-[16px] text-[#181818] font-bold">시급</p>
              <p className="text-[16px] text-[#717171] font-semibold">20,000원</p>
            </div>
          </div>
        </button>
      );
    case 1:
      return (
        <button className="flex flex-col w-full p-[20px] border border-[2px] border-[#FAF9F9] gap-[14px] rounded-[10px] shadow-sm">
          <div className="flex items-center">
            <img className="w-[20px] mr-[6px]" src="assets/images/old-man.png" />
            <p className="text-[18px] text-[#3C3939] font-bold">김누구 어르신 </p>
          </div>
          <p className="text-[15px] text-[#9C9898] font-semibold">식사보조, 배변보조, 이동보조</p>
          <div className="flex flex-col gap-[6px]">
            <div className="flex gap-[20px]">
              <p className="text-[16px] text-[#181818] font-bold">일정</p>
              <p className="text-[16px] text-[#717171] font-semibold">매주 2회 / 월, 수 / 2시간</p>
            </div>
            <div className="flex gap-[20px]">
              <p className="text-[16px] text-[#181818] font-bold">기간</p>
              <p className="text-[16px] text-[#717171] font-semibold">25.02.18 ~ 25.08.18</p>
            </div>
            <div className="flex gap-[20px]">
              <p className="text-[16px] text-[#181818] font-bold">위치</p>
              <p className="text-[16px] text-[#717171] font-semibold">서울 노원구 공릉동 화랑로 425-13</p>
            </div>
            <div className="flex gap-[20px]">
              <p className="text-[16px] text-[#181818] font-bold">시급</p>
              <p className="text-[16px] text-[#717171] font-semibold">20,000원</p>
            </div>
          </div>
        </button>
      );
  }
};

export default CareSeniorItem;
