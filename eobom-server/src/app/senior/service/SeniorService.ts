import {txProcess} from "@lib/db";
import {Gender} from "src/app/common/CommonConstants";
import {SeniorGrade} from "../SeniorConstants";
import manager from "@routes/api/manager";
import {UserType} from "@user/UserConstants";
import Manager from "@user/entity/Manager";
import Senior from "../entity/Senior";

export async function addSenior({
  userId,
  userType,
  seniorName,
  seniorBirth,
  seniorAddress,
  seniorGender,
  seniorGrade,
  seniorProfileImage,
  seniorMimeType,
}: {
  userId: string;
  userType: UserType;
  seniorName: string;
  seniorBirth: string;
  seniorAddress: string;
  seniorGender: Gender; // [”남성”, “여성”]
  seniorGrade: SeniorGrade; // ["등급없음", "1등급", "2등급", "3등급", "4등급", "5등급", "인지지원등급"]
  seniorProfileImage?: string;
  seniorMimeType?: string;
}) {
  return await txProcess(async manager => {
    const isManager = userType === UserType.CENTERMANAGER;
    if (!isManager) {
      throw new Error(`잘못된 접근입니다. '관리사'로 접근해주세요: ${userType}`);
    }

    const managerRepository = manager.getRepository(Manager);
    const seniorRepository = manager.getRepository(Senior);

    const managerUser = await managerRepository.findOne({where: {managerId: userId}});

    if (!managerUser) {
      throw new Error("해당 관리사를 찾을 수 없습니다.");
    }

    const newSenior = seniorRepository.create({
      manager: managerUser,
      seniorName,
      seniorBirth,
      seniorAddress,
      seniorGender,
      seniorGrade,
      seniorProfileImage: seniorProfileImage ? Buffer.from(seniorProfileImage, "base64") : null,
      seniorMimeType: seniorMimeType || null,
    });
    const savedSenior = await seniorRepository.save(newSenior);

    return savedSenior;
  });
}

export async function editSenior({
  seniorId,
  userType,
  seniorName,
  seniorBirth,
  seniorAddress,
  seniorGender,
  seniorGrade,
  seniorProfileImage,
  seniorMimeType,
}: {
  seniorId: number;
  userType: UserType;
  seniorName: string;
  seniorBirth: string;
  seniorAddress: string;
  seniorGender: Gender; // [”남성”, “여성”]
  seniorGrade: SeniorGrade; // ["등급없음", "1등급", "2등급", "3등급", "4등급", "5등급", "인지지원등급"]
  seniorProfileImage?: string;
  seniorMimeType?: string;
}) {
  return await txProcess(async manager => {
    const isManager = userType === UserType.CENTERMANAGER;
    if (!isManager) {
      throw new Error(`잘못된 접근입니다. '관리사'로 접근해주세요: ${userType}`);
    }

    const seniorRepository = manager.getRepository(Senior);
    const senior = seniorRepository.findOne({where: {seniorId: seniorId}});

    if (!senior) {
      throw new Error("어르신이이 존재하지 않습니다.");
    }

    const savedSenior = await seniorRepository.update(seniorId, {
      seniorName,
      seniorBirth,
      seniorAddress,
      seniorGender,
      seniorGrade,
      seniorProfileImage: seniorProfileImage ? Buffer.from(seniorProfileImage, "base64") : null,
      seniorMimeType,
    });

    return savedSenior;
  });
}

export async function getSeniorInfo(seniorId: number) {
  return await Senior.findOne({where: {seniorId}});
}
