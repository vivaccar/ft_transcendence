import { FastifyInstance } from "fastify"
import { z } from 'zod'

export async function inviteFriend(app: FastifyInstance) {
	app.post('/inviteFriend',/*  { schema: registerMatchSwaggerSchema }, */ async(req, res) => {
		const matchSchema = z.object({
			date: z.string().transform((str) => new Date(str)),
			participants: z.array(z.object({
				username: z.string(),
				goals: z.number().int().min(0)
			}))
			.length(2)
			.refine(([p1, p2]) => p1.username !== p2.username, {
				message: 'Usernames must be different'
			})
		})
    	try {
			const body = matchSchema.parse(req.body) // faz o parse do request body, deixando o corpo da requisicao tipado e seguro para ser utilizado
			
			const match = await app.prisma.match.create ({
				data: {
					date: body.date,
					matchParticipant: {
						create: body.participants.map(p => ({
							user: {connect: {username: p.username}}, 
							goals: p.goals
						})) 
					}
				},
				include: {
					matchParticipant: {
						include: {
							user: true
						}
					}
				}
			})
		return res.status(201).send({matchId: match.id, playerOne: match.matchParticipant[0].user.username, playerTwo: match.matchParticipant[1].user.username})
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: err})
		}
	})
}