import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";
import {CenterGrade, UserType} from "@user/UserConstants";
import {certiType} from "src/app/documents/DocumentsConstants";
import {Gender} from "src/app/common/CommonConstants";
import {addManager, createJobOffer, editManagerInfo, getJobSearchList, managerMatching, sendMatching} from "@user/service/ManagerService";
import {verifyAccessToken} from "@utils/JwtUtils";
import {SeniorGrade} from "src/app/senior/SeniorConstants";
import {addSenior, editSenior, getSeniorInfo} from "src/app/senior/service/SeniorService";
import {matchingRecommend, sendUrgentMatching} from "src/app/employment/service/MatchingService";

export default async function (fastify: FastifyInstance) {
  fastify.post(
    "/sign_up",
    async (
      req: FastifyRequest<{
        Body: {
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
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const newUser = await addManager(req.body);
        return reply.send({
          message: "Manager sign up successful",
          user: newUser,
        });
      } catch (error: any) {
        // 중복 id 또는 기타 에러 발생 시 처리
        return reply.status(400).send({
          error: "Sign up failed",
          details: error.message,
        });
      }
    },
  );

  fastify.put(
    "/editManagerInfo",
    async (
      req: FastifyRequest<{
        Body: {
          name: string;
          phone: string;
          gender: Gender;
          profileImage?: string;
          mimeType?: string;
          centerName: string;
          hasBathVehicle: boolean;
          centerAddress: string;
          centerGrade?: CenterGrade;
          operatingPeriod?: string;
          centeIntro?: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const {name, phone, gender, profileImage, mimeType, centerName, hasBathVehicle, centerAddress, centerGrade, operatingPeriod, centeIntro} =
        req.body;
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({error: "Access Token이 없습니다."});
      }

      const accessToken = authHeader.split(" ")[1]; //Bearer 제거
      const {userId, userType} = await verifyAccessToken(accessToken);
      try {
        const savedManager = await editManagerInfo({
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
        });
        return reply.send({
          message: "EditManagerInfo is successful",
          user: savedManager,
        });
      } catch (error: any) {
        return reply.status(500).send({error: error.message});
      }
    },
  );

  fastify.post(
    "/addSenior",
    async (
      req: FastifyRequest<{
        Body: {
          seniorName: string;
          seniorBirth: string;
          seniorAddress: string;
          seniorGender: Gender; // [”남성”, “여성”]
          seniorGrade: SeniorGrade; // ["등급없음", "1등급", "2등급", "3등급", "4등급", "5등급", "인지지원등급"]
          seniorProfileImage: string;
          seniorMimeType: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const {seniorName, seniorBirth, seniorAddress, seniorGender, seniorGrade, seniorProfileImage, seniorMimeType} = req.body;
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return reply.status(401).send({error: "access token이 없습니다."});
        }

        const accessToken = authHeader.split(" ")[1]; //Bearer 제거
        const {userId, userType} = await verifyAccessToken(accessToken);
        const savedSenior = await addSenior({
          userId,
          userType,
          seniorName,
          seniorBirth,
          seniorAddress,
          seniorGender,
          seniorGrade,
          seniorProfileImage,
          seniorMimeType,
        });
        return reply.send({
          message: "AddSenior is successful",
          user: savedSenior,
        });
      } catch (err: any) {
        return reply.status(400).send({error: err.message});
      }
    },
  );

  fastify.post(
    "/editSenior",
    async (
      req: FastifyRequest<{
        Body: {
          seniorId: number;
          seniorName: string;
          seniorBirth: string;
          seniorAddress: string;
          seniorGender: Gender; // [”남성”, “여성”]
          seniorGrade: SeniorGrade; // ["등급없음", "1등급", "2등급", "3등급", "4등급", "5등급", "인지지원등급"]
          seniorProfileImage: string;
          seniorMimeType: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const {seniorId, seniorName, seniorBirth, seniorAddress, seniorGender, seniorGrade, seniorProfileImage, seniorMimeType} = req.body;
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return reply.status(401).send({error: "access token이 없습니다."});
        }

        const accessToken = authHeader.split(" ")[1]; //Bearer 제거
        const {userType} = await verifyAccessToken(accessToken);
        const savedSenior = await editSenior({
          seniorId,
          userType,
          seniorName,
          seniorBirth,
          seniorAddress,
          seniorGender,
          seniorGrade,
          seniorProfileImage,
          seniorMimeType,
        });
        return reply.send({
          message: "EditSenior is successful",
          user: savedSenior,
        });
      } catch (err: any) {
        return reply.status(400).send({error: err.message});
      }
    },
  );

  fastify.get(
    "/getSeniorInfo",
    async (
      req: FastifyRequest<{
        Querystring: {
          seniorId: number;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return reply.status(401).send({error: "access token이 없습니다."});
        }

        const accessToken = authHeader.split(" ")[1]; //Bearer 제거
        await verifyAccessToken(accessToken);

        const {seniorId} = req.query; // 쿼리스트링에서 seniorId 가져오기

        if (!seniorId) {
          return reply.status(400).send({error: "seniorId가 필요합니다."});
        }

        const senior = await getSeniorInfo(seniorId); // seniorId를 이용해 정보

        return reply.send({
          message: "getSenior is successful",
          senior: senior,
        });
      } catch (err: any) {
        return reply.status(500).send({error: err.message});
      }
    },
  );

  fastify.post(
    "/createJobOffer",
    async (
      req: FastifyRequest<{
        Body: {
          seniorId: number;
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
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const {
          seniorId,
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
        } = req.body;
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return reply.status(401).send({error: "access token이 없습니다."});
        }

        const accessToken = authHeader.split(" ")[1]; //Bearer 제거
        const {userId, userType} = await verifyAccessToken(accessToken);
        const jobOffer = await createJobOffer({
          seniorId,
          managerId: userId,
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
        });
        return reply.send({
          message: "create jobOffer is successful",
          jobOffer: jobOffer,
        });
      } catch (err: any) {
        return reply.status(400).send({error: err.message});
      }
    },
  );

  fastify.post(
    "/sendMatching",
    async (
      req: FastifyRequest<{
        Body: {
          jobSearchId: number;
          jobOfferId: number;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return reply.status(401).send({error: "access token이 없습니다."});
        }

        const accessToken = authHeader.split(" ")[1]; //Bearer 제거
        const {userType} = await verifyAccessToken(accessToken);

        const {jobSearchId, jobOfferId} = req.body;
        const savedMatching = await sendMatching(userType, jobSearchId, jobOfferId);
        return reply.send({
          message: "Matching Send is successful",
          savedMatching: savedMatching,
        });
      } catch (error: any) {
        // 중복 id 또는 기타 에러 발생 시 처리
        return reply.status(400).send({
          error: "매칭실패",
          details: error.message,
        });
      }
    },
  );

  fastify.get("/myMatching", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({error: "access token이 없습니다."});
      }

      const accessToken = authHeader.split(" ")[1]; //Bearer 제거
      const {userId, userType} = await verifyAccessToken(accessToken);
      const myMatchings = await managerMatching(userId, userType);
      return reply.send({
        message: "myMatchings is successful",
        myMatchings: myMatchings,
      });
    } catch (error: any) {
      // 중복 id 또는 기타 에러 발생 시 처리
      return reply.status(400).send({
        error: "매칭실패",
        details: error.message,
      });
    }
  });

  fastify.get(
    "/matchingRecommend",
    async (
      req: FastifyRequest<{
        Querystring: {
          jobOfferId: number;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return reply.status(401).send({error: "access token이 없습니다."});
        }

        const accessToken = authHeader.split(" ")[1]; //Bearer 제거
        await verifyAccessToken(accessToken);

        const {jobOfferId} = req.query;
        const recommends = matchingRecommend(jobOfferId);
        return reply.send({
          message: "recommend is successful",
          recommends: recommends,
        });
      } catch (error: any) {
        // 중복 id 또는 기타 에러 발생 시 처리
        return reply.status(400).send({
          error: "추천실패",
          details: error.message,
        });
      }
    },
  );
  fastify.get("/getJobSearchList", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({error: "access token이 없습니다."});
      }

      const accessToken = authHeader.split(" ")[1]; //Bearer 제거
      const {userType} = await verifyAccessToken(accessToken);
      const result = await getJobSearchList(userType);
      return reply.send({
        message: "search is successful",
        result: result,
      });
    } catch (err: any) {
      return reply.status(400).send({
        error: "추천실패",
        details: err.message,
      });
    }
  });
  fastify.post(
    "/sendUrgentMatching",
    async (
      req: FastifyRequest<{
        Querystring: {
          jobOfferId: number;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return reply.status(401).send({error: "access token이 없습니다."});
        }

        const accessToken = authHeader.split(" ")[1]; //Bearer 제거
        await verifyAccessToken(accessToken);

        const {jobOfferId} = req.query;

        const urgentMatching = await sendUrgentMatching(jobOfferId);
        return reply.send({
          message: "SendUrgentMatching is successful",
          urgentMatchings: urgentMatching,
        });
      } catch (err: any) {
        return reply.status(400).send({
          error: "긴급매칭 실패",
          details: err.message,
        });
      }
    },
  );
}
