import {txProcess} from "@lib/db";

import Caregiver from "@user/entity/Caregiver";
import User from "@user/entity/User";
import {UserType} from "@user/UserConstants";
import {generateAccessToken, generateRefreshToken} from "@utils/JwtUtils";
import bcrypt from "bcrypt";
import BusinessRegistration from "src/app/documents/entity/BusinessRegistration";
import Certification from "src/app/documents/entity/Certification";
import {MatchingState} from "src/app/employment/EmploymentConstants";
import JobOffer from "src/app/employment/entity/JobOffer";
import JobSearch from "src/app/employment/entity/JobSearch";
import Matching from "src/app/employment/entity/Matching";
import Senior from "src/app/senior/entity/Senior";
import Manager from "@user/entity/Manager";

export async function UserLogin(id: string, pw: string) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(User);
    const user = await repository.findOne({where: {id}});

    if (!user) {
      throw new Error("아이디가 존재하지 않습니다.");
    }

    const isMatch = await bcrypt.compare(pw, user.pw);

    if (!isMatch) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    const accessToken = generateAccessToken(user.userId, user.userType);
    const refreshToken = generateRefreshToken(user.userId, user.userType);
    const a = user.userId;
    const b = user.userType;
    await repository.update({id: user.id}, {refreshToken});

    return {accessToken, refreshToken, a, b};
  });
}

export async function deleteFCMToken(userId: string) {
  return await txProcess(async manager => {
    try {
      const repository = manager.getRepository(User);
      const user = await repository.findOne({where: {userId: userId}});
      if (!user) {
        throw new Error(`User with userId ${userId} not found`);
      }
      user.FCMToken = null;
      await repository.save(user);
      return true;
    } catch (error: any) {
      console.error(`Failed to delete FCM token for user ${userId}: ${error.message}`);
      throw new Error(`Failed to delete FCM token: ${error.message}`);
    }
  });
}

export async function userWithdrawal(userId: string, userType: UserType) {
  return await txProcess(async manager => {
    if (userType === "요양사") {
      const userRepository = manager.getRepository(User);
      const caregiverRepository = manager.getRepository(Caregiver);
      const certificationRepository = manager.getRepository(Certification);
      const jobSearchRepository = manager.getRepository(JobSearch);
      const matchingRepository = manager.getRepository(Matching);
      const jobOfferRepository = manager.getRepository(JobOffer);

      const jobSearches = await jobSearchRepository.find({
        where: {
          caregiver: {caregiverId: userId},
        },
        relations: ["matching"],
      });

      const allMatchings = jobSearches.flatMap(jobSearch => jobSearch.matching);

      const acceptedMatching = allMatchings.filter(matching => matching.matchingState === MatchingState.MATCHINGACCEPT);

      for (const matching of acceptedMatching) {
        const jobOffer = matching.jobOffer;

        if (jobOffer) {
          jobOffer.currentRecruits = Math.max(0, jobOffer.currentRecruits - 1);
          await jobOfferRepository.save(jobOffer);
        }
      }

      if (allMatchings.length > 0) {
        await matchingRepository.remove(allMatchings);
      }

      if (jobSearches.length > 0) {
        await jobSearchRepository.remove(jobSearches);
      }

      const certifications = await certificationRepository.find({
        where: {caregiver: {caregiverId: userId}},
      });

      if (certifications.length > 0) {
        await certificationRepository.remove(certifications);
      }

      await caregiverRepository.delete({caregiverId: userId});

      await userRepository.delete({userId});
    } else if (userType === "관리사") {
      const userRepository = manager.getRepository(User);
      const managerRepository = manager.getRepository(Manager);
      const businessRepository = manager.getRepository(BusinessRegistration);
      const seniorRepository = manager.getRepository(Senior);
      const jobOfferRepository = manager.getRepository(JobOffer);
      const matchingRepository = manager.getRepository(Matching);

      const jobOffers = await jobOfferRepository.find({
        where: {
          manager: {managerId: userId},
        },
        relations: ["matchings"],
      });

      const allMatchings = jobOffers.flatMap(jobOffer => jobOffer.matchings);

      if (allMatchings.length > 0) {
        await matchingRepository.remove(allMatchings);
      }

      await jobOfferRepository.remove(jobOffers);

      const seniors = await seniorRepository.find({where: {manager: {managerId: userId}}});
      await seniorRepository.remove(seniors);

      const business = await businessRepository.find({where: {manager: {managerId: userId}}});
      await businessRepository.remove(business);

      await managerRepository.delete({managerId: userId});

      await userRepository.delete({userId});
    } else {
      throw new Error("userType Error");
    }
    return {message: "회원정보 삭제 완료"};
  });
}

export async function getUserInfo(userId: string, userType: UserType) {
  if (userType === UserType.CAREGIVER) {
    return await User.findOne({
      where: {userId},
      relations: {caregiver: {certifications: true, jobSearches: true}},
    });
  } else if (userType === UserType.CENTERMANAGER) {
    return await User.findOne({
      where: {userId},
      relations: {manager: {businessRegistration: true, jobOffers: {senior: true}, seniors: true}},
    });
  } else {
    throw new Error("userType Error");
  }
}

export async function postFCM(userId: string, FCMToken: string) {
  return await txProcess(async manager => {
    const userRepository = manager.getRepository(User);

    const user = await userRepository.findOne({where: {userId}});

    if (!FCMToken) {
      throw new Error("토큰이이 존재하지 않습니다.");
    }

    if (user) {
      user.FCMToken = FCMToken;
      await userRepository.save(user);
    }

    return true;
  });
}
