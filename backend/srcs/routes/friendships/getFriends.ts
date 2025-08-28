import { FastifyInstance } from "fastify"
import { getFriendsSwaggerSchema } from "../../schemaSwagger/getFriendsSchema"

export async function getFriends(app: FastifyInstance) {
	app.get('/users/:username/getFriends', { preHandler: [app.authenticate], schema: getFriendsSwaggerSchema }, async(req, res) => {
		const { username } = req.params as { username: string }
		try {
			const userObject = await app.prisma.user.findUnique ({
				where: { username: username }
			})
			if (!userObject) {
				return res.status(404).send({error: 'username not found in database'})
			}
			
			const friendList = await app.prisma.friendship.findMany({
				where: {
					OR: [
						{ friendAId: userObject.id },
						{ friendBId: userObject.id }
					],
					status: "accepted"
				},
				include: {
					friendA: { select: { username: true }},
					friendB: { select: { username: true }}
				}
			})
			
			const formattedList = friendList.map(friendship => {
				const friend = friendship.friendA.username != userObject.username ? friendship.friendA : friendship.friendB 
				const status = friendship.status
				const currentTime = Date.now()
				const isOnline = friend.lastPing + 20000 > currentTime
				return {
					friend: friend.username,
					status: status,
					isOnline: isOnline
				}
			})
			return res.status(200).send({ friendships: formattedList })
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: err})
		}
	})
}