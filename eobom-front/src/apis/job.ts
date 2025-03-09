import { useRecoilState, useRecoilValue } from "recoil";
import { accessTokenState, userInfoState } from "../store/store";
import useAuth from "./auth";

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
  jobOfferSchedule: any,

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

type CreateJobProps = {
  seniorId: number,
  hourlyWage: number,
  caregiverCount: number,
  schedule: Map<string, { startTime: string; endTime: string }>,

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

  // isPhysicalFunctionSupportNeeded: false, // X
  // isToiletingAssistanceNeeded: false, // X
  requests: string,
  features: string[],
}

type CreateJobSearchProps = {
  addressList: string[],
  hourlyWage: number,
  schedule: Map<string, { startTime: string; endTime: string }>,
}

const useJob = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const accessToken = useRecoilValue(accessTokenState);
  const { getUserInfo } = useAuth();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  const createJobOffer = async ({ seniorId, hourlyWage, caregiverCount, schedule,
    isBathingAssistanceNeeded,
    isBodyWashingAssistanceNeeded,
    isCognitiveStimulationNeeded,
    isCognitiveBehaviorManagementNeeded,
    isCommunicationSupportNeeded,
    isDailyLivingSupportNeeded,
    isDressingAssistanceNeeded,
    isFeedingAssistanceNeeded,
    isGroomingAssistanceNeeded,
    isHousekeepingSupportNeeded,
    isHairWashingAssistanceNeeded,
    isMobilityAssistanceNeeded,
    isOralCareAssistanceNeeded,
    isPersonalActivitySupportNeeded,
    isPositionChangeAssistanceNeeded, requests, features }: CreateJobProps) => {
    // console.log(JSON.stringify(Object.fromEntries(schedule)));
    return await fetch(`${apiURL}/manager/createJobOffer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(
        {
          seniorId: seniorId,
          offerPay: hourlyWage,
          wantRecruits: caregiverCount,
          jobOfferSchedule: Object.fromEntries(schedule),
          reqMent: requests,
          wantList: features,

          isBathingAssistanceNeeded: isBathingAssistanceNeeded, // 준비된 음식으로 식사를 차려주세요
          isBodyWashingAssistanceNeeded: isBodyWashingAssistanceNeeded, // 죽, 반찬 등 요리를 해주세요
          isCognitiveStimulationNeeded: isCognitiveStimulationNeeded, // 경관식 보조가 필요해요

          isCognitiveBehaviorManagementNeeded: isCognitiveBehaviorManagementNeeded, // 가끔 대소변 실수 시 도와주세요
          isCommunicationSupportNeeded: isCommunicationSupportNeeded, // 기저귀 케어가 필요해요
          isDailyLivingSupportNeeded: isDailyLivingSupportNeeded, // 유치도뇨/방광루/장루 관리가 필요해요

          isDressingAssistanceNeeded: isDressingAssistanceNeeded, // 이동 시 부축 도움이 필요해요
          isFeedingAssistanceNeeded: isFeedingAssistanceNeeded, // 휠체어 이동 보조가 필요해요
          isGroomingAssistanceNeeded: isGroomingAssistanceNeeded, // 거동이 불가해요

          isHousekeepingSupportNeeded: isHousekeepingSupportNeeded, // 청소, 빨래를 도와주세요
          isHairWashingAssistanceNeeded: isHairWashingAssistanceNeeded, // 어르신 목욕을 도와주세요
          isMobilityAssistanceNeeded: isMobilityAssistanceNeeded, // 어르신 병원 동행이 필요해요
          isOralCareAssistanceNeeded: isOralCareAssistanceNeeded, // 산책과 간단한 운동을 도와주세요
          isPersonalActivitySupportNeeded: isPersonalActivitySupportNeeded, // 말벗 등 정서 지원이 필요해요
          isPositionChangeAssistanceNeeded: isPositionChangeAssistanceNeeded, // 인지자극 활동이 필요해요

          isPhysicalFunctionSupportNeeded: false, // X
          isToiletingAssistanceNeeded: false, // X

        }
      ),
    })
      .then((response) => {
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        return response.json();
      })
      .then((result) => {
        console.log(result);
          (async () => setUserInfo(await getUserInfo(result.accessToken)))();
        if (result.jobOffer) {
          return result.jobOffer.jobOfferId;
        }
        return null;
      });
  }

  const createJobSearch = async ({ addressList, hourlyWage, schedule }: CreateJobSearchProps) => {
    // console.log(JSON.stringify(Object.fromEntries(schedule)));
    return await fetch(`${apiURL}/caregiver/createJobSearch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(
        {
          coverRegion: addressList,
          wantPay: hourlyWage,
          jobSearchSchedule: Object.fromEntries(schedule),

          canBathingAssistance: true, // 준비된 음식으로 식사를 차려주세요
          canBodyWashingAssistance: true, // 죽, 반찬 등 요리를 해주세요
          canCognitiveStimulation: true, // 경관식 보조가 필요해요

          canCognitiveBehaviorManagement: true, // 가끔 대소변 실수 시 도와주세요
          canCommunicationSupport: true, // 기저귀 케어가 필요해요
          canDailyLivingSupport: true, // 유치도뇨/방광루/장루 관리가 필요해요

          canDressingAssistance: true, // 이동 시 부축 도움이 필요해요
          canFeedingAssistance: true, // 휠체어 이동 보조가 필요해요
          canGroomingAssistance: true, // 거동이 불가해요

          canHousekeepingSupport: true, // 청소, 빨래를 도와주세요
          canHairWashingAssistance: true, // 어르신 목욕을 도와주세요
          canMobilityAssistance: true, // 어르신 병원 동행이 필요해요
          canOralCareAssistance: true, // 산책과 간단한 운동을 도와주세요
          canPersonalActivitySupport: true, // 말벗 등 정서 지원이 필요해요
          canPositionChangeAssistance: true, // 인지자극 활동이 필요해요

          canPhysicalFunctionSupport: true, // X
          canToiletingAssistance: true, // X

        }
      ),
    })
      .then((response) => {
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        return response.json();
      })
      .then((result) => {
        return result;
      });
  }

  const getJobOffer = async (jobId: string) => {
    const userInfo = await getUserInfo();
    let result: JobOfferProps | null = null;
    userInfo.manager.jobOffers.map((offer: any) => {
      if (offer.jobOfferId === jobId) {
        result = offer;
      }
    })
    return result;
  }

  return { createJobOffer, getJobOffer, createJobSearch };
}

export default useJob;
