import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { inviteFriendSwaggerSchema } from "../../schemaSwagger/inviteFriendSchema"

export async function inviteFriend(app: FastifyInstance) {
	app.post('/inviteFriend', { preHandler: [app.authenticate], schema: inviteFriendSwaggerSchema }, async(req, res) => {
		const friendSchema = z.object({
			newFriend: z.string(),
		})
    	try {
			const body = friendSchema.parse(req.body) // faz o parse do request body, deixando o corpo da requisicao tipado e seguro para ser utilizado
			
			const currentUser = req.user
			const newFriend = await app.prisma.user.findUnique({where: { username: body.newFriend }})
			
			if (!newFriend) {
				 return res.status(404).send({ error: "User not found in database" })
			}
			if (newFriend.id == currentUser.id) {
				 return res.status(404).send({ error: "User cannot request friendship with yourself" })
			}
			
			const existingFriendship = await app.prisma.friendship.findFirst({ 
				where: {
					OR: [
						{ friendAId: currentUser.id, friendBId: newFriend.id },
						{ friendAId: newFriend.id, friendBId: currentUser.id }
					]
				}});
			if (existingFriendship) {
				return res.status(409).send({ error: "Friendship already exists between these users"})
			}

			//arrumar aqui
			// const [id1. ]
			const friendship = await app.prisma.friendship.create ({
				data: {
					friendA: {connect: { id: currentUser.id }},
					friendB: {connect: { id: newFriend.id }},
					status: "pending"
				}
			})
			return res.status(201).send({
				friendA: currentUser.username,
				friendB: newFriend.username,
				status: "pending"
			})
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: err})
		}
	})
}