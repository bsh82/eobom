import { useNavigate } from "react-router-dom";
import MatchingState from "./MatchingState";
import Space from "./Space";

type ItemProps = {
  senior: SeniorProps
  state?: number,
  jobId?: string,
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

const getGender = (gender: string) => {
  if (gender === "남성") {
    return "남";
  }
  return "여"
}

const SeniorItem = ({ senior, state, jobId }: ItemProps) => {
  const navigate = useNavigate();

  const handleNavigateAddJob = (seniorId: string) => {
    navigate(`/seniors/${seniorId}/jobs/add`);
  }

  const handleNavigateRecommend = (jobId?: string) => {
    if (jobId) {
      navigate(`/jobs/${jobId}/recommend`);
    }
  }

  switch (state) {
    default:
    case 0:
      return (
        <div className="flex flex-col w-full p-[20px] border border-[2px] border-[#FAF9F9] gap-[14px] rounded-[10px] shadow-sm">
          <div className="flex items-center">
            <img className="w-[20px] mr-[6px]" src="assets/images/old-man.png" />
            <p className="text-[18px] text-[#3C3939] font-bold">{senior.seniorName} 어르신 {`(만 ${getAge(senior.seniorBirth)}세, ${getGender(senior.seniorGender)})`}</p>
          </div>
          <p className="text-[16px] text-[#717171] font-semibold">{senior.seniorAddress}</p>
          <button className={`w-full min-h-[48px] bg-[#FAF9F9] cursor-pointer rounded-[8px] text-[16px] text-[#717171] font-bold`} onClick={() => handleNavigateAddJob(senior.seniorId)}>
            방문 요양 구인하기
          </button>
        </div>
      );
    case 1:
      return (
        <div className="flex flex-col w-full p-[20px] border border-[2px] border-[#FAF9F9] gap-[14px] rounded-[10px] shadow-sm">
          <div className="flex items-center">
            <img className="w-[20px] mr-[6px]" src="assets/images/old-man.png" />
            <p className="text-[18px] text-[#3C3939] font-bold">{senior.seniorName} 어르신</p>
          </div>
          <p className="text-[16px] text-[#717171] font-semibold">{`만 ${getAge(senior.seniorBirth)}세, ${getGender(senior.seniorGender)}, ${senior.seniorAddress.split(" ").slice(0, 2).join(" ")}`}</p>
          <MatchingState state={0} />
          <button className={`relative w-full min-h-[48px] bg-[#FF8411] cursor-pointer rounded-[10px] text-[16px] text-[#FFFFFF] font-bold`} onClick={() => handleNavigateRecommend(jobId)}>
            추천 보호사 리스트 확인하기
          </button>
        </div>
      );
    case 2:
      return (
        <div className="flex flex-col w-full p-[20px] bg-[#FFECC4] border border-[2px] border-[#FFAE00] gap-[8px] rounded-[10px] shadow-sm">
          <div className="flex items-center">
            <img className="w-[20px] mr-[6px]" src="assets/images/old-man.png" />
            <p className="text-[18px] text-[#3C3939] font-bold">{senior.seniorName} 어르신</p>
          </div>
          <p className="text-[16px] text-[#717171] font-semibold">만 82세, 남, 서울시 노원구</p>
          <p className="text-[14px] text-[#FF8411] font-bold">매칭이 거절되었어요</p>
          <Space css="h-[6px]" />
          <button className={`relative w-full min-h-[48px] bg-[#FF8411] cursor-pointer rounded-[10px] text-[16px] text-[#FFFFFF] font-bold`} onClick={() => { }}>
            다른 보호사님 찾기
          </button>
        </div>
      );
    case 3:
    case 4:
      return (
        <div className={`flex items-center justify-between w-full p-[20px] ${state === 3 ? "bg-[#FFFFFF]" : "bg-[#FAF9F9]"} border border-[2px] border-[#FAF9F9] rounded-[10px] shadow-sm`}>
          <div className="flex flex-col gap-[14px]">
            <div className="flex items-center">
              <img className="w-[20px] mr-[6px]" src="assets/images/old-man.png" />
              <p className="text-[18px] text-[#3C3939] font-bold">김누구 어르신</p>
            </div>
            <p className="text-[16px] text-[#717171] font-semibold">만 82세, 남, 서울시 노원구</p>
          </div>
          <p className="text-[15px] text-[#3C3939] font-bold">{state === 3 ? "돌봄 진행 중" : "근무 종료"}</p>
        </div>
      );
  }
};

export default SeniorItem;
