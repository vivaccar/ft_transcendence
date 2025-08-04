import { FastifyInstance } from "fastify"
import { z } from 'zod'

export async function registerUser(app: FastifyInstance) {
	app.post('/registerUser', async(req, res) => {
		const userSchema = z.object({ username: z.string()})
		});
		try {
			const user = userSchema.parse(req.body) // faz o parse do request body, deixando o corpo da requisicao tipado e seguro para ser utilizado
			
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