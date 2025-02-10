import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
import {apiLogger as logger} from "@config/winston.config";

export default function (fastify: FastifyInstance) {
  fastify.addHook("onSend", async (req: FastifyRequest, reply: FastifyReply, _) => {
    const ip = req.headers["x-forwarded-for"];
    const userAgent = req.headers["user-agent"];
    const url = req.url;
    const isNotStatic = !req.url.startsWith('/public') && !req.url.startsWith('/node_modules');
    const isNotHealthCheck = userAgent != "ELB-HealthChecker/2.0";
    if (reply.statusCode >= 400) {
      // 상태 코드가 400 이상인 경우 에러 로그 기록
      logger.error(`${ip} ${req.method} ${req.protocol}://${req.hostname}${url} ${reply.statusCode} ${userAgent}`);
    } else if (isNotHealthCheck && isNotStatic) {
      // 헬스 체크가 아니고 정적 파일 요청이 아닌 경우 정보 로그 기록
      logger.info(`${ip} ${req.method} ${req.protocol}://${req.hostname}${url} ${reply.statusCode} ${userAgent}`);
    }
  });
}
