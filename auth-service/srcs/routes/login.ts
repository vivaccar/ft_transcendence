import { FastifyInstance  } from "fastify";
import { compare } from 'bcryptjs';
import { z } from 'zod'


export async function loginRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const loginBody = z.object({
      username: z.string(),
      password: z.string(),
    })

    const { username, password } = loginBody.parse(request.body)

    const user = await app.prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return reply.status(400).send({ message: 'Invalid username or password' })
    }

    if (!(await compare(password, user.passwordHash))) {
        return reply.status(401).send({ error: 'Invalid credentials' });
    }

    return reply.status(200).send({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  })
}