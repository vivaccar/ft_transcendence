import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";

export default fp(async (fastify) => {
  fastify.register(fastifyCookie);

  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET!,
    cookie: {
      cookieName: "token",
      signed: false, 
    }
  });

  // Middleware para rotas normais
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify({ onlyCookie: true });

      if (request.user.partialToken) {
        return reply.code(401).send({ error: "Unauthorized" });
      }
    } catch (err) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });

  // Middleware para rotas que precisam do partialToken 
  fastify.decorate("preAuthenticate", async function (request, reply) {
    try {
      await request.jwtVerify({ onlyCookie: true });

      if (!request.user.partialToken) {
        return reply.code(401).send({ error: "Unauthorized" });
      }
    } catch (err) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });
});