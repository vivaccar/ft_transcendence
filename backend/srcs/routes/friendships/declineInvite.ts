import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { declineInviteSwaggerSchema } from "../../schemaSwagger/declineInviteSchema"

export async function declineInvite(app: FastifyInstance) {
	app.delete('/declineInvite', { preHandler: [app.authenticate], schema: declineInviteSwaggerSchema }, async(req, res) => {
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

			const [id1, id2] = currentUser.id < friend.id 
			? [currentUser.id, friend.id] 
			: [friend.id, currentUser.id]
			
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
			if (existingFriendship.status == "accepted") {
				return res.status(409).send({ error: "Invite was already accepted"})
			}

			const deleteFriendship = await app.prisma.friendship.delete ({
				where: {
					friendAId_friendBId: {
						friendAId: id1,
						friendBId: id2 
					}
				}
			})
			return res.status(201).send( `Friendship between ${currentUser.username} and ${friend.username} was declined and deleted from database`)
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: err})
		}
	})
}