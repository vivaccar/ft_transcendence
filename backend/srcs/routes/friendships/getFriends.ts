import { FastifyInstance } from "fastify"
//import { getInvitesSwaggerSchema } from "../../schemaSwagger/getInvitesSchema"

export async function getFriends(app: FastifyInstance) {
	app.get('/users/:username/getFriends', { preHandler: [app.authenticate]/* , schema: getInvitesSwaggerSchema  */}, async(req, res) => {
		const { username } = req.params as { username: string }
		try {
			const userObject = await app.prisma.user.findUnique ({
				where: { username: username }
			})
			if (!userObject) {
				return res.status(404).send({error: 'username not found in database'})
			}
			//arrumar aqui - user pode ser o friendB ou friendA na relacao
			/* const friendList = await app.prisma.friendship.findMany({
				where: {
					friendBId: userObject.id,
					status: "accepted"
				},
				include: {
					friendA: { select: { username: true }}
				}
			}) */
			
			const formattedList = friendList.map(friendship => {
				const friendName = friendship.friendA.username
				const status = friendship.status
				return {
					friend: friendName,
					status: status,
					isFriendOnline: friendList.friendA.
				}
			})
			return res.status(200).send({ invites: formattedInvites})
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: err})
		}
	})
}