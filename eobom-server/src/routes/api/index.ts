import {FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import caregiver from "./caregiver";
import validation from "./validation";
import manager from "./manager";
import user from "./user";

export default async function (fastify: FastifyInstance) {
  fastify.register(manager, {prefix: "/manager"});
  fastify.register(caregiver, {prefix: "/caregiver"});
  fastify.register(validation, {prefix: "/validation"});
  fastify.register(user, {prefix: "/user"});
}
