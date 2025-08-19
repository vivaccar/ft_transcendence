import { MatchParticipant } from "@prisma/client"
import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { getGoalsSwaggerSchema } from "../../schemaSwagger/getGoalsSchema"

export async function getGoals(app: FastifyInstance) {
	app.get('/users/:username/getGoals', { schema: getGoalsSwaggerSchema } , async(req, res) => {
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
						some: { userId: userObject.id }  // usa userId dentro de matchParticipant
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
						// Goals marcados pelo usuário (goals pro)
						goalsPro += participant.goals;
						console.log(`User scored ${participant.goals} goals in match ${match.id}. Total goalsPro: ${goalsPro}`)
					} else {
						// Goals marcados pelo oponente (goals contra)
						goalsCon += participant.goals;
						console.log(`Opponent scored ${participant.goals} goals in match ${match.id}. Total goalsCon: ${goalsCon}`)
					}
				}
			}
			return res.status(200).send({ goalsPro: goalsPro, goalsCon: goalsCon })
		} catch(error) {
			console.log('error getGoals:', error)
			return res.status(400).send({ message: 'Bad request', error: error })
		}
	})
}