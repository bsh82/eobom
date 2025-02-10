import { addUser } from "@user/service/UserService";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";


export default async function (fastify: FastifyInstance) {
  // name: string; masterid: number; gbn: string
  fastify.post(
    "/",
    async (
      req: FastifyRequest<{
        Body: {
          name: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const selected = await addUser(req.body);
      reply.send(selected);
    },
  );
}