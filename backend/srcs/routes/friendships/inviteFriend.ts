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
			
			//arrumar aqui - o id do user esta vindo errado do req.user (authenticate)
			console.log("req user", currentUser)
			console.log("current user:", currentUser.username)
			console.log("current user ID:", currentUser.id)
			console.log("new friend:", newFriend.username)
			console.log("new friend ID:", newFriend.id)
			const [id1, id2] = currentUser.id < newFriend.id 
			? [currentUser.id, newFriend.id] 
			: [newFriend.id, currentUser.id]

			const friendship = await app.prisma.friendship.create ({
				data: {
					friendA: {connect: { id: id1 }},
					friendB: {connect: { id: id2 }},
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