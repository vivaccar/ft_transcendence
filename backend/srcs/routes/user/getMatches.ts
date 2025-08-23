import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { getMatchSwaggerSchema } from "../../schemaSwagger/getMatchesSchema"

export async function getMatches(app: FastifyInstance) {
	app.get('/users/:username/getMatches', { preHandler: [app.authenticate] ,  schema: getMatchSwaggerSchema } , async(req, res) => {
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
					matchParticipant: {
						include: {
							user: {
								select: {
									id: true,
									username: true
								}
							}
						}
					}
				}
			})
			
			const formattedMatches = matches.map(match => {
				const currentUser = match.matchParticipant.find(p => p.userId === userObject.id)
				const opponent = match.matchParticipant.find(p => p.userId !== userObject.id || p.userId == null ) 
				
				if (!currentUser || !opponent) {
					return null
				}
				let result: string
				if (currentUser.goals > opponent.goals) {
					result = "win"
				} else {
					result = "loss"
				}
				return {
					matchId: match.id,
					opponent: opponent.user ? opponent.user.username : opponent.localUser,
					result: result,
					goalsUser: currentUser.goals,
					goalsOpponent: opponent.goals,
					dateTime: match.date
				}
			})
			return res.status(200).send({ matches: formattedMatches })
		} catch(error) {
			console.error('Error in getMatches:', error)
			return res.status(400).send({ message: 'Bad request', error: error })
		}
	})
}