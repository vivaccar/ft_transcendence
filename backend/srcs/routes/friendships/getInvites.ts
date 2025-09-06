import { FastifyInstance } from "fastify"
import { getInvitesSwaggerSchema } from "../../schemaSwagger/getInvitesSchema"

export async function getInvites(app: FastifyInstance) {
	app.get('/users/:username/getInvites', { preHandler: [app.authenticate], schema: getInvitesSwaggerSchema }, async(req, res) => {
		const { username } = req.params as { username: string }
		try {
			const userObject = await app.prisma.user.findUnique ({
				where: { username: username }
			})
			if (!userObject) {
				return res.status(404).send({error: 'username not found in database'})
			}

			const invites = await app.prisma.friendship.findMany({
				where: {
					friendBId: userObject.id,
					status: "pending"
				},
				include: {
					friendA: { select: { username: true }},
				}
			})
			
			const formattedInvites = invites.map(invite => {
				const requesterName = invite.friendA.username
				const status = invite.status
				return {
					requester: requesterName,
					status: status
				}
			})
			return res.status(200).send({ invites: formattedInvites})
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: err})
		}
	})
}