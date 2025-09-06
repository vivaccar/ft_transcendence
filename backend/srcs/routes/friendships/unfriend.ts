import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { unfriendSwaggerSchema } from "../../schemaSwagger/unfriendSchema"

export async function unfriend(app: FastifyInstance) {
	app.delete('/unfriend', { preHandler: [app.authenticate], schema: unfriendSwaggerSchema }, async(req, res) => {
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
					OR :[
						{ friendAId: currentUser.id, friendBId: friend.id },
						{ friendAId: friend.id, friendBId: currentUser.id }
					]
				}});
			if (!existingFriendship) {
				return res.status(409).send({ error: "Friendship not found in database"})
			}
			if (existingFriendship.status != "accepted") {
				return res.status(409).send({ error: "Friendship invite was not accepted yet"})
			}

			const deleteFriendship = await app.prisma.friendship.delete ({ 
				where: {
					id: existingFriendship.id
				}
			})
			return res.status(201).send( `Friendship between ${currentUser.username} and ${friend.username} has come to the end` )
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: err})
		}
	})
}