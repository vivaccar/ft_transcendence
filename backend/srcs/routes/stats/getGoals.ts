import { MatchParticipant } from "@prisma/client"
import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { getGoalsSwaggerSchema } from "../../schemaSwagger/getGoalsSchema"

export async function getGoals(app: FastifyInstance) {
	app.get('/users/:username/getGoals', { preHandler: [app.authenticate] , schema: getGoalsSwaggerSchema } , async(req, res) => {
		const { username } = req.params as { username: string }
		try {
			const userObject = await app.prisma.user.findUnique ({
				where: { username: username }
			})
			if (!userObject) {
				return res.status(404).send({error: 'username not found in database'})
			}
			const matches = await app.prisma.match.findMany({
				  where: {
					matchParticipant: {
						some: { userId: userObject.id }  
						}
					},
					include: {
						matchParticipant: true 
					}
			})
			let goalsPro = 0;
			let goalsCon = 0;
			for (const match of matches) {
				for (const participant of match.matchParticipant) {
					if (participant.userId === userObject.id) {
						goalsPro += participant.goals;
					} else {
						goalsCon += participant.goals;
					}
				}
			}
			return res.status(200).send({ goalsPro: goalsPro, goalsCon: goalsCon })
		} catch(error) {
			return res.status(400).send({ message: 'Bad request', error: error })
		}
	})
}