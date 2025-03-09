import {txProcess} from "@lib/db";
import User from "@user/entity/User";
import {CenterGrade, UserType} from "@user/UserConstants";
import {Gender} from "src/app/common/CommonConstants";
import bcrypt from "bcrypt";
import Manager from "@user/entity/Manager";
import BusinessRegistration from "src/app/documents/entity/BusinessRegistration";
import Senior from "src/app/senior/entity/Senior";
import JobOffer from "src/app/employment/entity/JobOffer";
import {JobOfferState, JobSearchState, MatchingState} from "src/app/employment/EmploymentConstants";
import JobSearch from "src/app/employment/entity/JobSearch";
import Matching from "src/app/employment/entity/Matching";
import {sendPushNotification} from "@utils/FirebaseUtils";

export async function addManager({
  id,
  pw,
  name,
  phone,
  userType,
  gender,
  profileImage,
  mimeType,
  centerName,
  hasBathVehicle,
  centerAddress,
  centerGrade,
  operatingPeriod,
  centeIntro,
  b_no,
  p_nm,
  start_dt,
}: {
  id: string;
  pw: string;
  name: string;
  phone: string;
  userType: UserType;
  gender: Gender;
  profileImage?: string;
  mimeType?: string;
  centerName: string;
  hasBathVehicle: boolean;
  centerAddress: string;
  centerGrade?: CenterGrade;
  operatingPeriod?: string;
  centeIntro?: string;
  b_no: string;
  p_nm: string;
  start_dt: string;
}) {
  return await txProcess(async manager => {
    //관리리사인지 확인
    const isCaregiver = userType === UserType.CENTERMANAGER;
    if (!isCaregiver) {
      throw new Error(`잘못된 접근입니다. '관리사'로 등록해주세요: ${userType}`);
    }

    const userRepository = manager.getRepository(User);
    const managerRepository = manager.getRepository(Manager);
    const businessRegRepository = manager.getRepository(BusinessRegistration);

    // 1️⃣ ID 중복 검사
    const existingUser = await userRepository.findOne({where: {id}});
    if (existingUser) {
      throw new Error(`이미 사용 중인 id입니다: ${id}`);
    }

    // 2️⃣ 비밀번호 해싱
    const saltRounds = 10;
    const hashedPw = await bcrypt.hash(pw, saltRounds);

    // 3️⃣ User 테이블에 저장
    const newUser = userRepository.create({
      id,
      pw: hashedPw,
      name,
      phone,
      userType,
      gender,
      profileImage: profileImage ? Buffer.from(profileImage, "base64") : null,
      mimeType,
    });
    const savedUser = await userRepository.save(newUser);

    // 4️⃣ Manager 테이블에 저장 (userId와 동일한 managerId 사용)
    const newManager = managerRepository.create({
      managerId: savedUser.userId,
      user: savedUser,
      centerName,
      hasBathVehicle,
      centerAddress,
      centerGrade,
      operatingPeriod,
      centeIntro,
    });
    const savedManager = await managerRepository.save(newManager);
    savedUser.manager = savedManager;

    // 5️⃣ BusinessRegistration 테이블에 저장 (managerId와 연결)
    const newBusinessReg = businessRegRepository.create({
      manager: savedManager,
      b_no,
      p_nm,
      start_dt,
    });
    await businessRegRepository.save(newBusinessReg);
    savedManager.businessRegistration = newBusinessReg;

    return savedManager;
  });
}

export async function editManagerInfo({
  userId,
  name,
  phone,
  userType,
  gender,
  profileImage,
  mimeType,
  centerName,
  hasBathVehicle,
  centerAddress,
  centerGrade,
  operatingPeriod,
  centeIntro,
}: {
  userId: string;
  name: string;
  phone: string;
  userType: UserType;
  gender: Gender;
  profileImage?: string;
  mimeType?: string;
  centerName: string;
  hasBathVehicle: boolean;
  centerAddress: string;
  centerGrade?: CenterGrade;
  operatingPeriod?: string;
  centeIntro?: string;
}) {
  return await txProcess(async manager => {
    const isManager = userType === UserType.CENTERMANAGER;
    if (!isManager) {
      throw new Error(`잘못된 접근입니다. '관리사'로 접근해주세요: ${userType}`);
    }

    const userRepository = manager.getRepository(User);
    const managerRepository = manager.getRepository(Manager);

    const user = await userRepository.findOne({where: {userId: userId}});
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }

    await userRepository.update(userId, {
      name,
      phone,
      gender,
      profileImage: profileImage ? Buffer.from(profileImage, "base64") : null,
      mimeType: mimeType || null,
    });

    const managerUser = await managerRepository.findOne({where: {managerId: userId}});
    if (!managerUser) {
      throw new Error("관리사 정보가 존재하지 않습니다.");
    }

    const savedManager = await managerRepository.update(managerUser.managerId, {
      centerName,
      hasBathVehicle,
      centerAddress,
      centerGrade: centerGrade || null,
      operatingPeriod: operatingPeriod || undefined,
      centeIntro: centeIntro || null,
    });

    return savedManager;
  });
}

export async function createJobOffer({
  seniorId,
  managerId,
  userType,
  offerPay,
  wantRecruits,
  jobOfferSchedule,
  reqMent,
  wantList,
  isBathingAssistanceNeeded,
  isOralCareAssistanceNeeded,
  isFeedingAssistanceNeeded,
  isGroomingAssistanceNeeded,
  isDressingAssistanceNeeded,
  isHairWashingAssistanceNeeded,
  isBodyWashingAssistanceNeeded,
  isToiletingAssistanceNeeded,
  isMobilityAssistanceNeeded,
  isPositionChangeAssistanceNeeded,
  isPhysicalFunctionSupportNeeded,
  isCognitiveStimulationNeeded,
  isDailyLivingSupportNeeded,
  isCognitiveBehaviorManagementNeeded,
  isCommunicationSupportNeeded,
  isPersonalActivitySupportNeeded,
  isHousekeepingSupportNeeded,
}: {
  seniorId: number;
  managerId: string;
  userType: UserType;
  offerPay: number;
  wantRecruits: number;
  jobOfferSchedule: Record<string, {startTime: string; endTime: string}[]>;
  reqMent: string;
  wantList: string[];
  isBathingAssistanceNeeded: boolean;
  isOralCareAssistanceNeeded: boolean;
  isFeedingAssistanceNeeded: boolean;
  isGroomingAssistanceNeeded: boolean;
  isDressingAssistanceNeeded: boolean;
  isHairWashingAssistanceNeeded: boolean;
  isBodyWashingAssistanceNeeded: boolean;
  isToiletingAssistanceNeeded: boolean;
  isMobilityAssistanceNeeded: boolean;
  isPositionChangeAssistanceNeeded: boolean;
  isPhysicalFunctionSupportNeeded: boolean;
  isCognitiveStimulationNeeded: boolean;
  isDailyLivingSupportNeeded: boolean;
  isCognitiveBehaviorManagementNeeded: boolean;
  isCommunicationSupportNeeded: boolean;
  isPersonalActivitySupportNeeded: boolean;
  isHousekeepingSupportNeeded: boolean;
}) {
  return await txProcess(async manager => {
    const isManager = userType === UserType.CENTERMANAGER;
    if (!isManager) {
      throw new Error(`잘못된 접근입니다. '관리사'로 접근해주세요: ${userType}`);
    }

    const managerRepository = manager.getRepository(Manager);
    const seniorRepository = manager.getRepository(Senior);
    const jobOfferRepository = manager.getRepository(JobOffer);

    const managerUser = await managerRepository.findOne({where: {managerId}});
    if (!managerUser) {
      throw new Error("해당 관리자가 존재하지 않습니다.");
    }

    const senior = await seniorRepository.findOne({where: {seniorId}});
    if (!senior) {
      throw new Error("해당 시니어가 존재하지 않습니다.");
    }

    const newjobOffer = jobOfferRepository.create({
      manager: managerUser,
      senior: senior,
      offerPay,
      wantRecruits,
      currentRecruits: 0,
      jobOfferState: JobOfferState.MATCHINGWAITNG,
      jobOfferSchedule,
      reqMent,
      wantList,
      isBathingAssistanceNeeded,
      isOralCareAssistanceNeeded,
      isFeedingAssistanceNeeded,
      isGroomingAssistanceNeeded,
      isDressingAssistanceNeeded,
      isHairWashingAssistanceNeeded,
      isBodyWashingAssistanceNeeded,
      isToiletingAssistanceNeeded,
      isMobilityAssistanceNeeded,
      isPositionChangeAssistanceNeeded,
      isPhysicalFunctionSupportNeeded,
      isCognitiveStimulationNeeded,
      isDailyLivingSupportNeeded,
      isCognitiveBehaviorManagementNeeded,
      isCommunicationSupportNeeded,
      isPersonalActivitySupportNeeded,
      isHousekeepingSupportNeeded,
    });
    // 저장
    const savedJobOffer = await jobOfferRepository.save(newjobOffer);

    return savedJobOffer;
  });
}

export async function sendMatching(userType: UserType, jobSearchId: number, jobOfferId: number) {
  try {
    return await txProcess(async manager => {
      const isManager = userType === UserType.CENTERMANAGER;
      if (!isManager) {
        throw new Error(`잘못된 접근입니다. '관리사'로 접근해주세요: ${userType}`);
      }

      const jobSearchRepository = manager.getRepository(JobSearch);
      const jobOfferRepository = manager.getRepository(JobOffer);
      const matchingRepository = manager.getRepository(Matching);

      const jobSearch = await jobSearchRepository.findOne({
        where: {jobSearchId},
        relations: ["caregiver"], // JobSearch와 연결된 caregiver 관계를 불러옵니다.
      });

      if (!jobSearch) {
        throw new Error("해당 구직이 존재하지 않습니다.");
      }

      const caregiverId = jobSearch.caregiver.caregiverId; // caregiverId를 추출

      const jobOffer = await jobOfferRepository.findOne({where: {jobOfferId}});
      if (!jobOffer) {
        throw new Error("해당 구인이 존재하지 않습니다.");
      }

      const newMatching = matchingRepository.create({
        jobSearch: jobSearch,
        jobOffer: jobOffer,
        matchingState: MatchingState.MATCHINGREQUEST,
      });

      const savedMatching = await matchingRepository.save(newMatching);
      await sendPushNotification(caregiverId, "매칭요청 알림", "센터에서 귀하에게 구인 요청을 보냈습니다. 이어봄에서 확인해보세요!");
      return savedMatching;
    });
  } catch (error: any) {
    // 여기에 더 구체적인 에러 처리 추가
    throw new Error(`매칭 처리 중 오류 발생: ${error.message}`);
  }
}

export async function managerMatching(managerId: string, userType: UserType) {
  const isManager = userType === UserType.CENTERMANAGER;
  if (!isManager) {
    throw new Error(`잘못된 접근입니다. '관리사'로 접근해주세요: ${userType}`);
  }

  return await Manager.findOne({
    where: {managerId},
    relations: {jobOffers: {matchings: {jobSearch: {caregiver: {user: true}}}}, seniors: true},
  });
}

export async function getJobSearchList(userType: UserType) {
  const isManager = userType === UserType.CENTERMANAGER;
  if (!isManager) {
    throw new Error(`잘못된 접근입니다. '관리사'로 접근해주세요: ${userType}`);
  }
  return await JobSearch.find({where: {jobSearchState: JobSearchState.MATCHINGWAITNG}});
}
