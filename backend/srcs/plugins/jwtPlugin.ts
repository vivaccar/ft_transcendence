import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

export default fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET!,
  });

  fastify.decorate('authenticate', async function (request, reply) {
    console.log("entrou aqui")
    try {
      await request.jwtVerify(); // Isso preenche request.user se o token for valido
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
});