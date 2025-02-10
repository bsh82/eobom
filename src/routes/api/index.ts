import {FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import user from "./user";

export default async function (fastify: FastifyInstance) {
  fastify.register(user, {prefix: "/user"});
}
