import { FastifyInstance  } from "fastify";
import { compare } from 'bcryptjs';
import { z } from 'zod'
import { loginSwaggerSchema } from '../schemas/login'


export async function loginRoutes(app: FastifyInstance) {
  app.post('/auth/login', { schema: loginSwaggerSchema }, 
    async (request, reply) => {
    const loginBody = z.object({
      username: z.string(),
      password: z.string(),
    })

    try
    {
      const { username, password } = loginBody.parse(request.body)
    }
    catch (error)
    {
      return reply.status(400).send({ message: 'Bad request' })
    }


    const user = await app.prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return reply.status(400).send({ message: 'Invalid username' })
    }

    if (!(await compare(password, user.passwordHash))) {
        return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = app.jwt.sign(
      {
        sub: user.id,
        username: user.username,
      },
      { expiresIn: '7d' }
    );

    return reply.status(200).send({
      token,
    })
  })
}