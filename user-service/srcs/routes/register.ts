import { FastifyInstance } from "fastify"
import { z } from 'zod'

export async function registerUser(app: FastifyInstance) {
	app.post('/registerUser', async(req, res) => {
		const userSchema = z.object({ username: z.string()})
		try {
			const { username } = userSchema.parse(req.body) // faz o parse do request body, deixando o corpo da requisicao tipado e seguro para ser utilizado
			
			const user = await app.prisma.user.create({
				data: { 
					username
				},
			})
			return res.status(201).send({id: user.id, username: user.username })
			} catch(err) {
				console.error(err)
				return res.status(200).send({error: err})
			}
		});
}

export async function registerMatch(app: FastifyInstance) {
	app.post('/registerMatch', async(req, res) => {
		const matchSchema = z.object({ //cria o esquema de como o zod quer que o request body seja validado
			date: z.string().transform((str) => new Date(str)),
     		participants: z.array(z.object({
        		userId: z.int(),
        		goals: z.int()
			})).length(2)
			.refine(([p1, p2]) =>  p1.userId !== p2.userId, {
				message: 'User IDs must be different',
			})
		});
    	try {
			const body = matchSchema.parse(req.body) // faz o parse do request body, deixando o corpo da requisicao tipado e seguro para ser utilizado
			
			const match = await app.prisma.match.create ({
				data: {
					date: body.date,
					matchParticipant: {
						create: body.participants.map(p => ({
							user: {connect: {id: p.userId}}, 
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
			return res.status(200).send({error: err})
		}
	})
}