import { useEffect, useState } from "react";
import Button from "../../../components/common/Button";
import Space from "../../../components/common/Space";
import CenterHeader from "../../../components/common/CenterHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { centerInfoState, userInfoState } from "../../../store/store";
import useMatching from "../../../apis/matching";
import useAuth from "../../../apis/auth";
import useJob from "../../../apis/job";

type SeniorProps = {
  seniorId: string,
  seniorName: string,
  seniorAddress: string,
  seniorBirth: string,
  seniorGender: string,
  seniorGrade: string,
}

type JobOfferProps = {
  jobOfferId: string,
  offerPay: string,
  reqMent: string,
  wantList: string[],
  jobOfferSchedule: Map<string, { startTime: string; endTime: string }>,

  isBathingAssistanceNeeded: boolean, // 준비된 음식으로 식사를 차려주세요
  isBodyWashingAssistanceNeeded: boolean, // 죽, 반찬 등 요리를 해주세요
  isCognitiveStimulationNeeded: boolean, // 경관식 보조가 필요해요

  isCognitiveBehaviorManagementNeeded: boolean, // 가끔 대소변 실수 시 도와주세요
  isCommunicationSupportNeeded: boolean, // 기저귀 케어가 필요해요
  isDailyLivingSupportNeeded: boolean, // 유치도뇨/방광루/장루 관리가 필요해요

  isDressingAssistanceNeeded: boolean, // 이동 시 부축 도움이 필요해요
  isFeedingAssistanceNeeded: boolean, // 휠체어 이동 보조가 필요해요
  isGroomingAssistanceNeeded: boolean, // 거동이 불가해요

  isHousekeepingSupportNeeded: boolean, // 청소, 빨래를 도와주세요
  isHairWashingAssistanceNeeded: boolean, // 어르신 목욕을 도와주세요
  isMobilityAssistanceNeeded: boolean, // 어르신 병원 동행이 필요해요
  isOralCareAssistanceNeeded: boolean, // 산책과 간단한 운동을 도와주세요
  isPersonalActivitySupportNeeded: boolean, // 말벗 등 정서 지원이 필요해요
  isPositionChangeAssistanceNeeded: boolean, // 인지자극 활동이 필요해요

  isPhysicalFunctionSupportNeeded: boolean, // X
  isToiletingAssistanceNeeded: boolean, // X

  senior: SeniorProps,
}

function JobDetail() {
  const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const weekdaysKorean = ["월", "화", "수", "목", "금", "토", "일"];

  const { jobId } = useParams<{ jobId: string }>();
  const [jobOffer, setJobOffer] = useState<JobOfferProps | null>();
  const [workingDays, setWorkingDays] = useState<string[]>([]);
  const navigate = useNavigate();
  const { getJobOffer } = useJob();

  useEffect(() => {
    getData();
  }, []);


  const getData = async () => {
    const offer : JobOfferProps | null = await getJobOffer(jobId!);
    setJobOffer(offer);
    if (offer) {
      weekdays.map((day: string, index) => {
        const schedules = new Map(Object.entries((offer as JobOfferProps).jobOfferSchedule)).get(day);
        schedules?.map((schedule: { startTime: string, endTime: string}) => {
          setWorkingDays(prev => [...prev, `(${weekdaysKorean[index]}) ${Number(schedule.startTime.substring(0, 2))}시 ~ ${Number(schedule.endTime.substring(0, 2))}시`]);
        });
      })
    }
  };

  const handleNavigateRecommend = () => {
    navigate(`/jobs/${jobId}/recommend`);
  }

  const getImageName = (want: string) => {
    switch (want) {
      case "친절해요":
        return "hearts";
      case "위생 관리 철저해요":
        return "soap";
      case "근무 경험이 많아요":
        return "hospital";
      case "성실해요":
        return "running";
      case "차분해요":
        return "coffee";
      case "밝고 긍정적이에요":
        return "sun";
      case "소통을 잘해요":
        return "speech-balloon";
      case "믿음직해요":
        return "handshake";
      case "응급대처가 가능해요":
        return "ambulance";
      case "꼼꼼해요":
        return "memo";
      default:
        return "";
    }
  }

  const getAge = (birthday?: string) => {
    if (!birthday) return 0;
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

  const getWage = (wage: string) => {
    return String(wage).replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  

  return (
    <div className="flex flex-col justify-center font-pre select-none">
      <CenterHeader text="구인 정보 확인" prev={true} />
      <div className="flex flex-col justify-center p-[20px]">
        <Space css="h-[40px]" />
        <div className="flex w-full justify-center cursor-pointer">
          <div className="w-[130px] h-[130px] bg-[#FAF9F9] rounded-full">
            <img src={"/assets/icons/profile.svg"} />
            <div className="relative top-[-30px] left-[100px] flex justify-center items-center w-[32px] h-[32px] bg-[#FAF9F9] rounded-full shadow-md">
              <img className="w-[16px]" src="/assets/icons/camera.svg" />
            </div>
          </div>
        </div>
        <Space css="h-[8px]" />
        <p className="text-[24px] font-bold text-center">{jobOffer?.senior?.seniorName} 어르신</p>
        <Space css="h-[40px]" />
        <div className="flex flex-col">
          <p className="text-[20px] text-[#181818] font-bold inline underline decoration-8 underline-offset-[-2px] decoration-[#FFF2CC]">근무 정보</p>
        </div>
        <div className="flex flex-col p-[12px] text-[#3C3939] gap-[10px]">
          <div className="flex">
            <div>
              <img className="w-[24px] mr-[6px]" src="/assets/icons/calendar-bold.svg" />
            </div>
            <div>
              {
                workingDays.map((day) => {
                  return <p className="text-[18px] font-bold">{day}</p>;
                })
              }
              {/* <p className="text-[18px] font-bold">{"(월) 9시 ~ 11시"}</p>
              <p className="text-[18px] font-bold">{"(수) 9시 ~ 11시"}</p> */}
            </div>
          </div>
          <div className="flex">
            <div>
              <img className="w-[24px] mr-[6px]" src="/assets/icons/location.svg" />
            </div>
            <div>
              {
                jobOffer?.senior?.seniorAddress.split("@").map((address, index) => {
                  return <p key={index} className="text-[18px] font-bold">{address}</p>;
                })
              }
              {/* <p className="text-[18px] font-bold">{jobOffer?.senior?.seniorAddress}</p> */}
              {/* <p className="text-[18px] font-bold">한신아파트 102동 501호</p> */}
            </div>
          </div>
        </div>
        <Space css="h-[40px]" />
        <div className={`flex items-center p-[20px] w-full h-[50px] border border-[#D4D2D2] rounded-[10px] shadow-sm font-bold text-[16px]`} >
          <div className="flex items-center flex-1">
            <p className="text-[#717171]">제안 급여</p>
          </div>
          <p className="text-[#3C3939]">시간당 {getWage(jobOffer?.offerPay ?? "0")}원</p>
        </div>
        <Space css="h-[40px]" />
        <div className="flex flex-col">
          <p className="text-[20px] text-[#181818] font-bold inline underline decoration-8 underline-offset-[-2px] decoration-[#FFF2CC]">
            어르신 정보
          </p>
        </div>
        <div className="flex p-[12px] text-[#3C3939] gap-[10px]">
          <div className="flex flex-col gap-[6px]">
            <div className="flex gap-[12px]">
              <p className="text-[18px] font-bold text-[#717171]">나이</p>
              <p className="text-[18px] font-bold text-[#181818]">만 {getAge(jobOffer?.senior.seniorBirth)}세</p>
            </div>
            <div className="flex gap-[12px]">
              <p className="text-[18px] font-bold text-[#717171]">성별</p>
              <p className="text-[18px] font-bold text-[#181818]">{jobOffer?.senior.seniorGender}</p>
            </div>
            <div className="flex gap-[12px]">
              <p className="text-[18px] font-bold text-[#717171]">장기요양등급</p>
              <p className="text-[18px] font-bold text-[#181818]">{jobOffer?.senior.seniorGrade}</p>
            </div>
          </div>
          {/* <Space css="w-[6px]" />
          <div className="flex flex-col gap-[6px]">
            <div className="flex gap-[12px]">
              <p className="text-[18px] font-bold text-[#717171]">성별</p>
              <p className="text-[18px] font-bold text-[#181818]">{jobOffer?.senior.seniorGender}</p>
            </div>
            <div className="flex gap-[12px]">
              <p className="text-[18px] font-bold text-[#717171]">몸무게</p>
              <p className="text-[18px] font-bold text-[#181818]">66kg</p>
            </div>
            <div className="flex gap-[12px]">
              <p className="text-[18px] font-bold text-[#717171]">치매등급</p>
              <p className="text-[18px] font-bold text-[#181818]">중증도</p>
            </div> */}
          {/* </div> */}
        </div>
        <Space css="h-[40px]" />
        <div className="flex flex-col">
          <p className="text-[20px] text-[#181818] font-bold inline underline decoration-8 underline-offset-[-2px] decoration-[#FFF2CC]">
            이런 서비스가 필요해요
          </p>
        </div>
        <div className="flex flex-col p-[12px] text-[#3C3939]">
          <div className="flex flex-wrap gap-[10px]">
            {
              jobOffer?.isBathingAssistanceNeeded || jobOffer?.isBodyWashingAssistanceNeeded || jobOffer?.isCognitiveStimulationNeeded
                ? <div className={`w-[106px] h-[34px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
                  <img className="w-[16px] mr-[4px]" src="/assets/images/rice.png" />
                  식사보조
                </div>
                : null
            }
            {
              jobOffer?.isCognitiveBehaviorManagementNeeded || jobOffer?.isCommunicationSupportNeeded || jobOffer?.isDailyLivingSupportNeeded
                ? <div className={`w-[106px] h-[34px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
                  <img className="w-[16px] mr-[4px]" src="/assets/images/toilet.png" />
                  배변보조
                </div>
                : null
            }
            {
              jobOffer?.isDressingAssistanceNeeded || jobOffer?.isFeedingAssistanceNeeded || jobOffer?.isGroomingAssistanceNeeded
                ? <div className={`w-[106px] h-[34px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
                  <img className="w-[16px] mr-[4px]" src="/assets/images/wheelchair.png" />
                  이동보조
                </div>
                : null
            }
            {
              jobOffer?.isHousekeepingSupportNeeded || jobOffer?.isHairWashingAssistanceNeeded || jobOffer?.isMobilityAssistanceNeeded || jobOffer?.isOralCareAssistanceNeeded || jobOffer?.isPersonalActivitySupportNeeded || jobOffer?.isPositionChangeAssistanceNeeded
                ? <div className={`w-[106px] h-[34px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
                  <img className="w-[16px] mr-[4px]" src="/assets/images/broom.png" />
                  생활보조
                </div>
                : null
            }
          </div>
          <Space css="h-[20px]" />
          <div className="flex flex-col gap-[6px]">
            {
              jobOffer?.isBathingAssistanceNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  준비된 음식으로 식사를 차려주세요
                </div>
                : null
            }
            {
              jobOffer?.isBodyWashingAssistanceNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  죽, 반찬 등 요리를 해주세요
                </div>
                : null
            }
            {
              jobOffer?.isCognitiveStimulationNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  경관식 보조가 필요해요
                </div>
                : null
            }

            {
              jobOffer?.isCognitiveBehaviorManagementNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  가끔 대소변 실수 시 도와주세요
                </div>
                : null
            }
            {
              jobOffer?.isCommunicationSupportNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  기저귀 케어가 필요해요
                </div>
                : null
            }
            {
              jobOffer?.isDailyLivingSupportNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  유치도뇨/방광루/장루 관리가 필요해요
                </div>
                : null
            }

            {
              jobOffer?.isDressingAssistanceNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  이동 시 부축 도움이 필요해요
                </div>
                : null
            }
            {
              jobOffer?.isFeedingAssistanceNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  휠체어 이동 보조가 필요해요
                </div>
                : null
            }
            {
              jobOffer?.isGroomingAssistanceNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  거동이 불가해요
                </div>
                : null
            }

            {
              jobOffer?.isHousekeepingSupportNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  청소, 빨래를 도와주세요
                </div>
                : null
            }
            {
              jobOffer?.isHairWashingAssistanceNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  어르신 목욕을 도와주세요
                </div>
                : null
            }
            {
              jobOffer?.isMobilityAssistanceNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  어르신 병원 동행이 필요해요
                </div>
                : null
            }
            {
              jobOffer?.isOralCareAssistanceNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  산책과 간단한 운동을 도와주세요
                </div>
                : null
            }
            {
              jobOffer?.isPersonalActivitySupportNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  말벗 등 정서 지원이 필요해요
                </div>
                : null
            }
            {
              jobOffer?.isPositionChangeAssistanceNeeded
                ? <div className={`w-full h-[36px] flex items-center cursor-pointer font-bold text-[18px] text-[#181818]`}>
                  <img className="w-[18px] mr-[8px]" src="/assets/images/check-mark.png" />
                  인지자극 활동이 필요해요
                </div>
                : null
            }
          </div>
        </div>
        <Space css="h-[40px]" />
        <div className="flex flex-col">
          <p className="text-[20px] text-[#181818] font-bold inline underline decoration-8 underline-offset-[-2px] decoration-[#FFF2CC]">
            이런 보호사님을 원해요
          </p>
        </div>
        <div className="flex flex-col p-[12px] text-[#3C3939]">
          <div className="flex flex-wrap gap-[10px]">
            {
              jobOffer?.wantList?.map((want) => {
                const imageName = getImageName(want);
                if (imageName === "") {
                  return (
                    <div className={`h-[34px] p-[6px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
                      {want}
                    </div>
                  );
                }
                return (
                  <div className={`h-[34px] p-[6px] flex justify-center items-center bg-[#FAF9F9] rounded-full text-[#3C3939] shadow-sm font-bold text-[16px]`}>
                    <img className="w-[16px] mr-[4px]" src={`/assets/images/${getImageName(want)}.png`} />
                    {want}
                  </div>
                );
              })
            }
          </div>
        </div>
        <Space css="h-[40px]" />
        <div className="flex flex-col">
          <p className="text-[20px] text-[#181818] font-bold inline underline decoration-8 underline-offset-[-2px] decoration-[#FFF2CC]">
            요청 사항
          </p>
        </div>
        <div className="flex flex-col p-[12px] text-[#3C3939]">
          <p className="text-[18px] font-semibold">{jobOffer?.reqMent}</p>
        </div>
      </div>
      <Space css={"h-[80px]"} />
      <Button text="추천 매칭 확인하기" onClick={handleNavigateRecommend} disabled={false} />
    </div>
  );
}

export default JobDetail;
