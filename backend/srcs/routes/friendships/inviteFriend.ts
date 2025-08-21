import { FastifyInstance } from "fastify"
import { z } from 'zod'

export async function inviteFriend(app: FastifyInstance) {
	app.post('/inviteFriend',/*  { schema: registerMatchSwaggerSchema }, */ async(req, res) => {
		const friendSchema = z.object({
			friendA: z.string(),
			friendB: z.string(),
		})
    	try {
			const body = friendSchema.parse(req.body) // faz o parse do request body, deixando o corpo da requisicao tipado e seguro para ser utilizado
			
			const userA = app.prisma.user.findUnique({where: { username: body.friendA }})
			const userB = app.prisma.user.findUnique({where: { username: body.friendB }})
			
			if (!userA || !userB) {
				 return res.status(404).send({ error: "One or more users not found in database" })
			}
			
			const existingFriendship = await app.prisma.friendship.findFirst({ 
				where: {
					OR: [
						{ friendAId: userA.id, friendBId: userB.id },
						{ friendAId: userB.id, friendBId: userA.id }
					]
				}});
			if (existingFriendship) {
				return res.status(409).send({ error: "Friendship already exists between these users"})
			}

			const friendship = await app.prisma.friendship.create ({
				data: {
					friendA: {connect: { username: body.friendA }},
					friendB: {connect: { username: body.friendB }},
					status: "pending"
				}
			})
			return res.status(201).send({
				friendA: body.friendA,
				friendB: body.friendB,
				status: "pending"
			})
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: err})
		}
	})
}