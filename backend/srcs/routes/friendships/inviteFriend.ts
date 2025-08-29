import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { inviteFriendSwaggerSchema } from "../../schemaSwagger/inviteFriendSchema"

export async function inviteFriend(app: FastifyInstance) {
	app.post('/inviteFriend', { preHandler: [app.authenticate], schema: inviteFriendSwaggerSchema }, async(req, res) => {
		const friendSchema = z.object({
			friend: z.string(),
		})
    	try {
			const body = friendSchema.parse(req.body) // faz o parse do request body, deixando o corpo da requisicao tipado e seguro para ser utilizado
			
			const currentUser = req.user
			const friend = await app.prisma.user.findUnique({where: { username: body.friend }})
			
			if (!friend) {
				 return res.status(404).send({ error: "User not found in database" })
			}
			if (friend.id == currentUser.id) {
				 return res.status(404).send({ error: "User cannot request friendship with yourself" })
			}
			
			const existingFriendship = await app.prisma.friendship.findFirst({ 
				where: {
					OR :[
						{ friendAId: currentUser.id, friendBId: friend.id },
						{ friendAId: friend.id, friendBId: currentUser.id }
					]
				}});
			if (existingFriendship) {
				return res.status(409).send({ error: "Friendship already exists between these users"})
			}

			const friendship = await app.prisma.friendship.create ({
				data: {
					friendA: {connect: { id: currentUser.id }}, 
					friendB: {connect: { id: friend.id }},
					status: "pending"
				}
			})
			return res.status(201).send({
				friendA: currentUser.username,
				friendB: friend.username,
				status: "pending"
			})
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: err})
		}
	})
}