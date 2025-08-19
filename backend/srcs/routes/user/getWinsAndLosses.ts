import { MatchParticipant } from "@prisma/client"
import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { getWinsAndLossesSwaggerSchema } from "../../schemaSwagger/getWinsAndLossesSchema"

export async function getWinsAndLosses(app: FastifyInstance) {
	app.get('/users/:username/getWinsAndLosses', { schema: getWinsAndLossesSwaggerSchema } , async(req, res) => {
		const { username } = req.params as { username: string }
		try {
			const userObject = await app.prisma.user.findUnique ({
				where: { username: username }
			})
			if (!userObject) {
				return res.status(404).send({error: 'username not found in database'})
			}
			console.log('userObject:', userObject)
			const matches = await app.prisma.match.findMany({
				  where: {
					matchParticipant: {
						some: { userId: userObject.id }  // usa userId dentro de matchParticipant
						}
					},
					include: {
						matchParticipant: true  // ou include user também, se precisar do username
					}
			})
			console.log('matches:', matches)
			let wins = 0;
			let losses = 0;
			for (const match of matches) {
				const sorted = match.matchParticipant.sort((a:MatchParticipant,b:MatchParticipant) => b.goals - a.goals)
				const winner = sorted[0]
				if (winner.userId == userObject.id){
					wins++
				} else {
					losses++
				}
			}
			return res.status(200).send({ wins: wins, losses: losses })
		} catch(error) {
			console.log('error getWins:', error)
			return res.status(400).send({ message: 'Bad request', error: error })
		}
	})
}