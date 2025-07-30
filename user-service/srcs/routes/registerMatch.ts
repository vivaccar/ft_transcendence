import { FastifyInstance } from "fastify"
import { z } from 'zod'

export async function registerMatch(app: FastifyInstance) {
	app.post('/registerMatch', async(req, res) => {
		const matchSchema = z.object({ //cria o esquema de como o zod quer que o request body seja validado
			date: z.string().transform((str) => new Date(str)),
     		participants: z.array(z.object({
        		userId: z.int(),
        		goals: z.int()
			}))
		});
    	try {
			const body = matchSchema.parse(req.body) // faz o parse do request body, deixando o corpo da requisicao tipado e seguro para ser utilizado
			
			const match = await app.prisma.match.create ({
				data: {
					date: body.date,
					match: {
						create: body.participants.map(p => ({
							user: {connect: {id: p.userId}}, 
							goals: p.goals
						})) 
					}
				},
				include: {
					match: true
				}
			})
		} catch(err) {
			console.error(err)
		}
		return res.status(201)
	})
}
/* 
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
} */