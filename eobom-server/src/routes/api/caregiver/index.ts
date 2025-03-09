import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";
import {UserType} from "@user/UserConstants";
import {certiType} from "src/app/documents/DocumentsConstants";
import {Gender} from "src/app/common/CommonConstants";
import {
  acceptMatching,
  addCaregiver,
  caregiverMatching,
  createJobSearch,
  denyMatching,
  editCaregiverInfo,
  negoMatching,
} from "@user/service/CaregiverService";
import {verifyAccessToken} from "@utils/JwtUtils";

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
          certifications: {certiNumber: string; certiType: certiType}[];
          caregiverAddress: string;
          hasCar: boolean;
          hasDrivingLicense: boolean;
          isDmentialTrained: boolean;
          career?: {campany: string; period: string; contents: string}[];
          intro: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const newUser = await addCaregiver(req.body);
        reply.send({
          message: "Caregiver sign up successful",
          user: newUser,
        });
      } catch (error: any) {
        // 중복 id 또는 기타 에러 발생 시 처리
        reply.status(500).send({
          error: "Sign up failed",
          details: error.message,
        });
      }
    },
  );

  fastify.put(
    "/editCaregiverInfo",
    async (
      req: FastifyRequest<{
        Body: {
          name: string;
          phone: string;
          gender: Gender;
          profileImage?: string;
          mimeType?: string;
          caregiverAddress: string;
          hasCar: boolean;
          hasDrivingLicense: boolean;
          isDmentialTrained: boolean;
          career?: {campany: string; period: string; contents: string}[];
          intro: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const {name, phone, gender, profileImage, mimeType, caregiverAddress, hasCar, hasDrivingLicense, isDmentialTrained, career, intro} = req.body;
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({error: "access token이 없습니다."});
      }

      const accessToken = authHeader.split(" ")[1]; //Bearer 제거
      const {userId, userType} = await verifyAccessToken(accessToken);
      try {
        const message = await editCaregiverInfo({
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
        });
        return reply.send(message);
      } catch (error: any) {
        return reply.status(500).send({error: error.message});
      }
    },
  );

  fastify.post(
    "/createJobSearch",
    async (
      req: FastifyRequest<{
        Body: {
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
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const {
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
        } = req.body;
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return reply.status(401).send({error: "access token이 없습니다."});
        }

        const accessToken = authHeader.split(" ")[1]; //Bearer 제거
        const {userId, userType} = await verifyAccessToken(accessToken);

        const jobSearch = await createJobSearch({
          caregiverId: userId,
          userType: userType,
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
        });
        reply.send({
          message: "CreateJobSearch is Successful",
          user: jobSearch,
        });
      } catch (err: any) {
        return reply.status(500).send({error: err.message});
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
      const myMatchings = await caregiverMatching(userId, userType);
      return reply.send({
        message: "myMatchings is successful",
        myMatchings: myMatchings,
      });
    } catch (err: any) {
      return reply.status(500).send({error: err.message});
    }
  });

  fastify.post(
    "/acceptMatching",
    async (
      req: FastifyRequest<{
        Querystring: {
          matchingId: number;
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

        const {matchingId} = req.query;

        const result = await acceptMatching(matchingId, userType);
        return reply.send({
          message: "수락완료",
          result: result,
        });
      } catch (error: any) {
        // 중복 id 또는 기타 에러 발생 시 처리
        return reply.status(400).send({
          error: "오류",
          details: error.message,
        });
      }
    },
  );
  fastify.post(
    "/negoMatching",
    async (
      req: FastifyRequest<{
        Querystring: {
          matchingId: number;
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

        const {matchingId} = req.query;

        const result = await negoMatching(matchingId, userType);
        return reply.send({
          message: "조율율완료",
          result: result,
        });
      } catch (error: any) {
        // 중복 id 또는 기타 에러 발생 시 처리
        return reply.status(400).send({
          error: "오류",
          details: error.message,
        });
      }
    },
  );
  fastify.post(
    "/denyMatching",
    async (
      req: FastifyRequest<{
        Querystring: {
          matchingId: number;
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

        const {matchingId} = req.query;

        const result = await denyMatching(matchingId, userType);
        return reply.send({
          message: "거절완료",
          result: result,
        });
      } catch (error: any) {
        // 중복 id 또는 기타 에러 발생 시 처리
        return reply.status(400).send({
          error: "오류",
          details: error.message,
        });
      }
    },
  );
}
