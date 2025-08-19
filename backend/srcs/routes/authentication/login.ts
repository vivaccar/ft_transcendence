import { FastifyInstance  } from "fastify";
import { compare } from 'bcryptjs';
import { z } from 'zod'
import { loginSwaggerSchema } from "../../schemaSwagger/loginSchema"


export async function loginRoutes(app: FastifyInstance) {
  app.post('/auth/login', { schema: loginSwaggerSchema }, async (request, reply) => {
    const loginBody = z.object({
      username: z.string(),
      password: z.string(),
    });

    let username: string;
    let password: string;
    try {
      ({ username, password } = loginBody.parse(request.body));
    } catch (error) {
      return reply.status(400).send({ message: 'Bad request' });
    }

    const user = await app.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return reply.status(400).send({ message: 'Invalid username' });
    }

    if (!(await compare(password, user.passwordHash))) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    if (user.has2fa) {
      const token = app.jwt.sign(
        {
          id: user.id,
          username: user.username,
          partialToken: true,
        },
        { expiresIn: '3m' }
      );

      return reply.status(200).send({ token: token, has2fa: true });
    }

    const token = app.jwt.sign(
      {
        id: user.id,
        username: user.username,
        partialToken: false,
      },
      { expiresIn: '7d' }
    );

    return reply.status(200).send({ token: token, has2fa: false });
  });
}