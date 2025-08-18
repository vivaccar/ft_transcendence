import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

export default fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET!,
    cookie: {
      cookieName: 'token',
      signed: false,
    }
  });

  fastify.decorate('authenticate', async function (request, reply) {
    console.log("entrou auth")
    try {
          await request.jwtVerify();

          // Bloqueia se for um 2fa pendente
          if (request.user.partialToken) {
            return reply.code(401).send({ error: 'Unauthorized' });
          }
        } catch (err) {
          return reply.code(401).send({ error: 'Unauthorized' });
        }
  });

  fastify.decorate('preAuthenticate', async function (request, reply) {
    console.log("entrou pre-auth")
    try {

      await request.jwtVerify();
      
      if (!request.user.partialToken)
         return reply.code(401).send({ error: 'Unauthorized' });
    } catch (err) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });
});