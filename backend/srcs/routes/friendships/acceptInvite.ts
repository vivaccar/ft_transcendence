import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { acceptInviteSwaggerSchema } from "../../schemaSwagger/acceptInviteSchema"

export async function acceptInvite(app: FastifyInstance) {
	app.patch('/acceptInvite', { preHandler: [app.authenticate], schema: acceptInviteSwaggerSchema }, async(req, res) => {
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
			
			const existingFriendship = await app.prisma.friendship.findFirst({ 
				where: { 
					friendAId: friend.id,
					friendBId: currentUser.id
				}});
			if (!existingFriendship) {
				return res.status(409).send({ error: "Friendship not found in database"})
			}
			if (existingFriendship.status == "accepted") {
				return res.status(409).send({ error: "Invite was already accepted"})
			}

			const friendship = await app.prisma.friendship.update ({
				where: {
					id : existingFriendship.id
				},
				data: {
					status: "accepted"
				},
				include: {
					friendA: true,
					friendB: true
				}
			})
			return res.status(201).send({ newFriendship: {
				friendshipId : friendship.id,
				friendA: friendship.friendA.username,
				friendB: friendship.friendB.username,
				status: friendship.status
			} })
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: err})
		}
	})
}