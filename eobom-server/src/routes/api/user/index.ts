import {getUserInfo, postFCM, UserLogin, userWithdrawal} from "@user/service/UserService";
import {generateAccessToken, verifyAccessToken, verifyRefreshToken} from "@utils/JwtUtils";
import {error} from "console";
import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.post(
    "/login",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          pw: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const {id, pw} = req.body;

        // 로그인 처리
        const {accessToken, refreshToken} = await UserLogin(id, pw);

        // 응답 헤더에 accessToken 설정 (옵션)
        reply.setCookie("refreshToken", refreshToken, {
          httpOnly: true, // JavaScript에서 접근 불가
          secure: process.env.NODE_ENV === "production", // HTTPS에서만 전송
          sameSite: "strict", // CSRF 방지
          path: "/", // 전체 도메인에서 유효
        });

        return reply.send({accessToken});
      } catch (error: any) {
        return reply.status(400).send({message: error.message});
      }
    },
  );

  fastify.post("/getAccessToken", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      // 쿠키에서 refresh token 추출
      const refreshToken = req?.cookies?.refreshToken;

      // refresh token이 없으면 오류 반환
      if (!refreshToken) {
        return reply.status(401).send({error: "refreshtoken이 없습니다. 다시 로그인하세요."});
      }

      // refresh token 검증
      const {userId, userType} = await verifyRefreshToken(refreshToken);

      // 새로운 access token 생성
      const accessToken = generateAccessToken(userId, userType);

      // 새로운 access token 반환
      return reply.send({accessToken});
    } catch (error: any) {
      // refresh token이 유효하지 않거나 만료된 경우
      return reply.status(401).send({error: error.message});
    }
  });

  fastify.delete("/withdrawal", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({error: "access token이 없습니다."});
      }

      const accessToken = authHeader.split(" ")[1]; //Bearer 제거
      const {userId, userType} = await verifyAccessToken(accessToken);
      const message = await userWithdrawal(userId, userType);
      reply.send(message);
    } catch (err: any) {
      return reply.status(500).send({error: err.message});
    }
  });

  fastify.get("/getUserInfo", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({error: "access token이 없습니다."});
      }

      const accessToken = authHeader.split(" ")[1]; //Bearer 제거
      const {userId, userType} = await verifyAccessToken(accessToken);
      const user = await getUserInfo(userId, userType);
      return reply.send(user);
    } catch (err: any) {
      return reply.status(500).send({error: err.message});
    }
  });

  fastify.post(
    "/postFCM",
    async (
      req: FastifyRequest<{
        Body: {
          FCMToken: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const {FCMToken} = req.body;

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return reply.status(401).send({error: "access token이 없습니다."});
        }
        const accessToken = authHeader.split(" ")[1]; //Bearer 제거
        const {userId} = await verifyAccessToken(accessToken);

        const result = await postFCM(userId, FCMToken);
        return reply.send({
          message: "post is successful",
          result: result,
        });
      } catch (err: any) {
        return reply.status(500).send({error: err.message});
      }
    },
  );
}
