import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";
import axios from "axios";
import config from "@config/validationconfig.json";

export default async function (fastify: FastifyInstance) {
  fastify.post(
    "/",
    async (
      req: FastifyRequest<{
        Body: {
          b_no: string;
          p_nm: string;
          start_dt: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const {b_no, p_nm, start_dt} = req.body;

      if (!b_no || !p_nm || !start_dt) {
        return reply.status(400).send({success: false, message: "Missing required fields"});
      }

      const url = config.url;
      const info = {
        businesses: [
          {
            b_no: b_no,
            p_nm: p_nm,
            start_dt: start_dt,
          },
        ],
      };
      try {
        const response = await axios.post(url, info, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response?.data?.status_code == "OK" && Array.isArray(response?.data?.data)) {
          const validStatus = response.data.data[0]?.valid;
          if (validStatus == "01") {
            return reply.send({success: true, result: true});
          } else if (validStatus == "02") {
            return reply.send({success: true, result: false});
          }
        } else {
          return reply.status(400).send({success: false, message: "공공데이터API 오류"});
        }
      } catch (error) {
        console.error("공공데이터 API 요청 중 오류 발생:", error);
        return reply.status(500).send({success: false, message: "백엔드 서버 오류"});
      }
    },
  );
}
