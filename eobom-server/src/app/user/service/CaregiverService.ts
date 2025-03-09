import {txProcess} from "@lib/db";
import User from "@user/entity/User";
import Caregiver from "@user/entity/Caregiver";
import {UserType} from "@user/UserConstants";
import {Gender} from "src/app/common/CommonConstants";
import {certiType} from "src/app/documents/DocumentsConstants";
import Certification from "src/app/documents/entity/Certification";
import bcrypt from "bcrypt";
import manager from "@routes/api/manager";
import JobSearch from "src/app/employment/entity/JobSearch";
import {JobOfferState, JobSearchState, MatchingState} from "src/app/employment/EmploymentConstants";
import Matching from "src/app/employment/entity/Matching";
import JobOffer from "src/app/employment/entity/JobOffer";
import {Not} from "typeorm";
import {sendPushNotification} from "@utils/FirebaseUtils";

export async function addCaregiver({
  id,
  pw,
  name,
  phone,
  userType,
  gender,
  profileImage,
  mimeType,
  certifications,
  caregiverAddress,
  hasCar,
  hasDrivingLicense,
  isDmentialTrained,
  career,
  intro,
}: {
  id: string;
  pw: string;
  name: string;
  phone: string;
  userType: UserType;
  gender: Gender;
  profileImage?: string;
  mimeType?: string;
  certifications: {certiNumber: string; certiType: certiType}[];
  caregiverAddress: string;
  hasCar: boolean;
  hasDrivingLicense: boolean;
  isDmentialTrained: boolean;
  career?: {campany: string; period: string; contents: string}[];
  intro: string;
}) {
  return await txProcess(async manager => {
    //요양사인지 확인
    const isCaregiver = userType === UserType.CAREGIVER;
    if (!isCaregiver) {
      throw new Error(`잘못된 접근입니다. '요양사'로 등록해주세요: ${userType}`);
    }

    const userRepository = manager.getRepository(User);
    const caregiverRepository = manager.getRepository(Caregiver);

    //아이디 중복 검사사
    const existingUser = await userRepository.findOne({where: {id}});
    if (existingUser) {
      throw new Error(`이미 사용 중인 id입니다: ${id}`);
    }

    //비밀번호 해싱 (bcrypt 사용)
    const saltRounds = 10;
    const hashedPw = await bcrypt.hash(pw, saltRounds);

    // 1. User 저장 (userId가 자동 생성됨)
    const newUser = userRepository.create({
      id,
      pw: hashedPw,
      name,
      phone,
      userType,
      gender,
      profileImage: profileImage ? Buffer.from(profileImage, "base64") : null,
      mimeType: mimeType || null,
    });
    const savedUser = await userRepository.save(newUser);

    // 2. Caregiver 저장 (caregiverId를 savedUser.userId로 사용)
    const newCaregiver = caregiverRepository.create({
      caregiverId: savedUser.userId, // User의 PK와 동일하게 사용
      user: savedUser,
      caregiverAddress,
      hasCar,
      hasDrivingLicense,
      isDmentialTrained,
      career: career || null,
      intro: intro || null,
    });
    const savedCaregiver = await caregiverRepository.save(newCaregiver);
    savedUser.caregiver = savedCaregiver;

    // 3. Certification 저장 (각 자격증을 caregiver와 연관시켜 저장)
    if (Array.isArray(certifications) && certifications.length > 0) {
      const certificationRepository = manager.getRepository(Certification);
      const certificationEntities = certifications.map(cert =>
        certificationRepository.create({
          certiNumber: cert.certiNumber,
          certiType: cert.certiType,
          caregiver: savedCaregiver,
        }),
      );
      await certificationRepository.save(certificationEntities);
      savedCaregiver.certifications = certificationEntities;
    }

    return savedUser;
  });
}

export async function editCaregiverInfo({
  userId,
  name,
  phone,
  userType,
  gender,
  profileImage,
  mimeType,
  caregiverAddress,
  hasCar,
  hasDrivingLicense,
  isDmentialTrained,
  career,
  intro,
}: {
  userId: string;
  name: string;
  phone: string;
  userType: UserType;
  gender: Gender;
  profileImage?: string;
  mimeType?: string;
  caregiverAddress: string;
  hasCar: boolean;
  hasDrivingLicense: boolean;
  isDmentialTrained: boolean;
  career?: {campany: string; period: string; contents: string}[];
  intro: string;
}) {
  return await txProcess(async manager => {
    const isCaregiver = userType === UserType.CAREGIVER;
    if (!isCaregiver) {
      throw new Error(`잘못된 접근입니다. '요양사'로 접근근해주세요: ${userType}`);
    }

    const userRepository = manager.getRepository(User);
    const caregiverRepository = manager.getRepository(Caregiver);

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

    const caregiver = await caregiverRepository.findOne({where: {caregiverId: userId}});
    if (!caregiver) {
      throw new Error("요양사 정보가 존재하지 않습니다.");
    }

    const savedCaregiver = await caregiverRepository.update(caregiver.caregiverId, {
      caregiverAddress,
      hasCar,
      hasDrivingLicense,
      isDmentialTrained,
      intro,
      career: career || null,
    });

    return savedCaregiver;
  });
}

export async function createJobSearch({
  caregiverId,
  userType,
  coverRegion,
  wantPay,
  jobSearchSchedule,
  canOralCareAssistance,
  canFeedingAssistance,
  canGroomingAssistance,
  canDressingAssistance,
  canHairWashingAssistance,
  canBodyWashingAssistance,
  canToiletingAssistance,
  canMobilityAssistance,
  canPositionChangeAssistance,
  canPhysicalFunctionSupport,
  canCognitiveStimulation,
  canDailyLivingSupport,
  canCognitiveBehaviorManagement,
  canCommunicationSupport,
  canPersonalActivitySupport,
  canHousekeepingSupport,
}: {
  caregiverId: string;
  userType: UserType;
  coverRegion: string[];
  wantPay: number;
  jobSearchSchedule: Record<string, {startTime: string; endTime: string}[]>;
  canOralCareAssistance: boolean;
  canFeedingAssistance: boolean;
  canGroomingAssistance: boolean;
  canDressingAssistance: boolean;
  canHairWashingAssistance: boolean;
  canBodyWashingAssistance: boolean;
  canToiletingAssistance: boolean;
  canMobilityAssistance: boolean;
  canPositionChangeAssistance: boolean;
  canPhysicalFunctionSupport: boolean;
  canCognitiveStimulation: boolean;
  canDailyLivingSupport: boolean;
  canCognitiveBehaviorManagement: boolean;
  canCommunicationSupport: boolean;
  canPersonalActivitySupport: boolean;
  canHousekeepingSupport: boolean;
}) {
  return await txProcess(async manager => {
    const isCaregiver = userType === UserType.CAREGIVER;
    if (!isCaregiver) {
      throw new Error(`잘못된 접근입니다. '요양사'로 접근근해주세요: ${userType}`);
    }

    const caregiverRepository = manager.getRepository(Caregiver);
    const jobSearchRepository = manager.getRepository(JobSearch);

    const caregiver = await caregiverRepository.findOne({where: {caregiverId: caregiverId}});
    if (!caregiver) {
      throw new Error("해당 요양사가 존재하지 않습니다.");
    }
    const newJobSearch = jobSearchRepository.create({
      caregiver: caregiver,
      coverRegion,
      wantPay,
      jobSearchState: JobSearchState.MATCHINGWAITNG,
      jobSearchSchedule,
      canOralCareAssistance,
      canFeedingAssistance,
      canGroomingAssistance,
      canDressingAssistance,
      canHairWashingAssistance,
      canBodyWashingAssistance,
      canToiletingAssistance,
      canMobilityAssistance,
      canPositionChangeAssistance,
      canPhysicalFunctionSupport,
      canCognitiveStimulation,
      canDailyLivingSupport,
      canCognitiveBehaviorManagement,
      canCommunicationSupport,
      canPersonalActivitySupport,
      canHousekeepingSupport,
    });
    // 저장
    const savedJobSearch = await jobSearchRepository.save(newJobSearch);
    return savedJobSearch;
  });
}

export async function caregiverMatching(caregiverId: string, userType: UserType) {
  const isCaregiver = userType === UserType.CAREGIVER;
  if (!isCaregiver) {
    throw new Error(`잘못된 접근입니다. '요양사'로 접근해주세요: ${userType}`);
  }

  return await Caregiver.findOne({
    where: {caregiverId},
    relations: {jobSearches: {matching: {jobOffer: {senior: true, manager: {user: true}}}}},
  });
}

export async function acceptMatching(matchingId: number, userType: UserType) {
  return await txProcess(async manager => {
    const isCaregiver = userType === UserType.CAREGIVER;
    if (!isCaregiver) {
      throw new Error(`잘못된 접근입니다. '요양사'로 접근해주세요: ${userType}`);
    }

    const matchingRepository = manager.getRepository(Matching);
    const jobSearchRepository = manager.getRepository(JobSearch);
    const jobOfferRepository = manager.getRepository(JobOffer);

    const matching = await matchingRepository.findOne({where: {matchingId}, relations: {jobOffer: true, jobSearch: true}});
    if (!matching) {
      throw new Error("매칭 정보가 존재하지 않습니다.");
    }

    const jobSearchId = matching.jobSearch.jobSearchId;
    const jobOfferId = matching.jobOffer.jobOfferId;

    const jobSearch = await jobSearchRepository.findOne({where: {jobSearchId}});
    if (!jobSearch) {
      throw new Error("구직 정보가 존재하지 않습니다.");
    }

    const jobOffer = await jobOfferRepository.findOne({where: {jobOfferId}});
    if (!jobOffer) {
      throw new Error("구인 정보가 존재하지 않습니다.");
    }

    matching.matchingState = MatchingState.MATCHINGACCEPT;
    jobSearch.jobSearchState = JobSearchState.MATCHINGACCEPT;

    jobOffer.currentRecruits += 1;

    await sendPushNotification(
      jobOffer.manager.managerId,
      `${jobSearch.caregiver.user.name} 님이 매칭을 수락했습니다.`,
      `${jobSearch.caregiver.user.name} 님이 매칭을 수락했으니 확인해 보세요.`,
    );

    try {
      // 먼저 matching과 jobSearch 저장
      await manager.save(matching);
      await manager.save(jobSearch);

      // 구인 정보의 currentRecruits가 wantRecruits와 같으면 매칭 삭제
      if (jobOffer.currentRecruits === jobOffer.wantRecruits) {
        jobOffer.jobOfferState = JobOfferState.MATCHINGCOMPLETE;

        // jobOffer와 관련된 모든 매칭 중 상태가 MATCHINGACCEPT가 아닌 매칭만 삭제
        await matchingRepository.delete({
          jobOffer: {jobOfferId},
          matchingState: Not(MatchingState.MATCHINGACCEPT), // 'MATCHINGACCEPT' 상태가 아닌 매칭만 삭제
        });

        // 구인 정보 저장
        await manager.save(jobOffer);
      }

      return true;
    } catch (error: any) {
      throw new Error(`매칭 처리 중 오류가 발생했습니다: ${error.message}`);
    }
  });
}

export async function negoMatching(matchingId: number, userType: UserType) {
  return await txProcess(async manager => {
    const isCaregiver = userType === UserType.CAREGIVER;
    if (!isCaregiver) {
      throw new Error(`잘못된 접근입니다. '요양사'로 접근해주세요: ${userType}`);
    }

    const matchingRepository = manager.getRepository(Matching);
    const jobSearchRepository = manager.getRepository(JobSearch);
    const jobOfferRepository = manager.getRepository(JobOffer);

    const matching = await matchingRepository.findOne({where: {matchingId}, relations: {jobOffer: true, jobSearch: true}});
    if (!matching) {
      throw new Error("매칭 정보가 존재하지 않습니다.");
    }

    const jobSearchId = matching.jobSearch.jobSearchId;
    const jobOfferId = matching.jobOffer.jobOfferId;

    const jobSearch = await jobSearchRepository.findOne({where: {jobSearchId}});
    if (!jobSearch) {
      throw new Error("구직 정보가 존재하지 않습니다.");
    }

    const jobOffer = await jobOfferRepository.findOne({where: {jobOfferId}});
    if (!jobOffer) {
      throw new Error("구인 정보가 존재하지 않습니다.");
    }
    await sendPushNotification(
      jobOffer.manager.managerId,
      `${jobSearch.caregiver.user.name} 님이 조율 요청을 보냈습니다.`,
      `${jobSearch.caregiver.user.name} 님이 조율 요청을 보냈으니니 보세요.`,
    );

    matching.matchingState = MatchingState.MATCHINGCOORDINATE;
    jobSearch.jobSearchState = JobSearchState.MATCHINGCOORDINATE;

    await manager.save(matching);
    await manager.save(jobSearch);

    return true;
  });
}

export async function denyMatching(matchingId: number, userType: UserType) {
  return await txProcess(async manager => {
    const isCaregiver = userType === UserType.CAREGIVER;
    if (!isCaregiver) {
      throw new Error(`잘못된 접근입니다. '요양사'로 접근해주세요: ${userType}`);
    }

    const matchingRepository = manager.getRepository(Matching);
    const jobSearchRepository = manager.getRepository(JobSearch);
    const jobOfferRepository = manager.getRepository(JobOffer);

    const matching = await matchingRepository.findOne({where: {matchingId}, relations: {jobSearch: true}});
    if (!matching) {
      throw new Error("매칭 정보가 존재하지 않습니다.");
    }

    const jobSearchId = matching.jobSearch.jobSearchId;
    const jobOfferId = matching.jobOffer.jobOfferId;

    const jobSearch = await jobSearchRepository.findOne({where: {jobSearchId}});
    if (!jobSearch) {
      throw new Error("구직 정보가 존재하지 않습니다.");
    }

    const jobOffer = await jobOfferRepository.findOne({where: {jobOfferId}});
    if (!jobOffer) {
      throw new Error("구인 정보가 존재하지 않습니다.");
    }
    await sendPushNotification(
      jobOffer.manager.managerId,
      `${jobSearch.caregiver.user.name} 님이 조율 요청을 보냈습니다.`,
      `${jobSearch.caregiver.user.name} 님이 조율 요청을 보냈으니니 보세요.`,
    );

    jobSearch.jobSearchState = JobSearchState.MATCHINGWAITNG;

    // 먼저 jobSearch 저장
    await manager.save(jobSearch);

    // 그 후 matching 삭제
    await manager.delete(Matching, matching);

    return true;
  });
}
