import { FastifyInstance  } from "fastify";
import { hash } from 'bcryptjs'
import { z, ZodError } from 'zod'
import { registerSwaggerSchema } from "../../schemaSwagger/registerSchema"


export async function registerRoutes(app: FastifyInstance) {
  app.post('/auth/register', {schema: registerSwaggerSchema },
    async (request, reply) => {
    const userBody = z.object({
      email: z.string().email({ message: 'Invalid email format' }),
      password: z.string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[A-Za-z]/, { message: 'Password must contain at least one letter' })
        .regex(/\d/, { message: 'Password must contain at least one number' }),
      username: z.string()
        .min(3, { message: 'Username must be at least 3 characters long' })
        .max(15, { message: 'Username must be maximum 15 characters' })
      . regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers and underscore' })
    })

    try {
      const { username, password, email } = userBody.parse(request.body)

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

      console.log

      return reply.status(201).send({ id: user.id, email: user.email })

    } catch (err) {
        if (err instanceof ZodError) {
          return reply.status(400).send({
            message: 'Validation error',
            errors: err.issues.map(e => ({
              path: e.path.join('.'),
              message: e.message,
            }))
          })
      }

      console.error(err)
      return reply.status(500).send({ message: 'Internal server error' })
    }
  })
}