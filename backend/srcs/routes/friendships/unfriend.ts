import { FastifyInstance } from "fastify"
import { z } from 'zod'
//import { inviteFriendSwaggerSchema } from "../../schemaSwagger/inviteFriendSchema"

export async function unfriend(app: FastifyInstance) {
	app.delete('/unfriend', { preHandler: [app.authenticate]/* , schema: inviteFriendSwaggerSchema  */}, async(req, res) => {
		const friendSchema = z.object({
			oldFriend: z.string(),
		})
    	try {
			const body = friendSchema.parse(req.body) // faz o parse do request body, deixando o corpo da requisicao tipado e seguro para ser utilizado
			
			const currentUser = req.user
			const oldFriend = await app.prisma.user.findUnique({where: { username: body.oldFriend }})
			
			if (!oldFriend) {
				 return res.status(404).send({ error: "User not found in database" })
			}

			const [id1, id2] = currentUser.id < oldFriend.id 
			? [currentUser.id, oldFriend.id] 
			: [oldFriend.id, currentUser.id]
			
			const existingFriendship = await app.prisma.friendship.findUnique({ 
				where: {
					friendAId_friendBId: {
						friendAId: id1,
						friendBId: id2 
					}
				}});
			if (!existingFriendship) {
				return res.status(409).send({ error: "Friendship not found in database"})
			}
			if (existingFriendship.status != "accepted") {
				return res.status(409).send({ error: "Friendship invite was not accepted yet"})
			}

			const deleteFriendship = await app.prisma.friendship.delete ({
				where: {
					friendAId_friendBId: {
						friendAId: id1,
						friendBId: id2 
					}
				}
			})
			return res.status(201).send( `Friendship between ${currentUser.username} and ${oldFriend.username} has come to the end` )
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: err})
		}
	})
}