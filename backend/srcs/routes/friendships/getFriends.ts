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
					friendA: { select: { username: true , lastPing: true}},
					friendB: { select: { username: true , lastPing: true}}
				}
			})
			
			const formattedList = friendList.map(friendship => {
				const friend = friendship.friendA.username != userObject.username
				? friendship.friendA 
				: friendship.friendB

				if (!friend) {
					return null
				}
				const status = friendship.status
				const currentTime = BigInt(Date.now())
				const isOnline = friend.lastPing + BigInt(10000) > currentTime
				return {
					friend: friend.username,
					status: status,
					isOnline: isOnline
				}
			}).filter(Boolean);
			return res.status(200).send({ friendships: formattedList })
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: err})
		}
	})
}