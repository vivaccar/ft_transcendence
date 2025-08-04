import { FastifyInstance  } from "fastify";
import { hash } from 'bcryptjs'
import { z } from 'zod'


export async function registerRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    
    const userBody = z.object({
            username: z.string(),
            password: z.string(),
            email: z.string(),
        })
        
    const { username, password, email } = userBody.parse(request.body);

    const emailExists = await app.prisma.user.findUnique({
      where: { email },
    })

    if (emailExists) {
      return reply.status(400).send({ message: 'Email already registered' })
    }

    const userExists = await app.prisma.user.findUnique({
      where: { username },
    })

    if (userExists) {
      return reply.status(400).send({ message: 'Username already in use' })
    }

    const passwordHash = await hash(password, 6)

    const user = await app.prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    })

    return reply.status(201).send({ id: user.id, email: user.email })
  })
}