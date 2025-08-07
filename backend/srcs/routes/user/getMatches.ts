import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { getMatchSwaggerSchema } from "../../schemaSwagger/getMatchesSchema"

export async function getMatches(app: FastifyInstance) {
	app.get('/getMatches', { schema: getMatchSwaggerSchema }, async(req, res) => {
		 const usernameSchema = z.object({ username: z.string(),})
		try {
      		const query = usernameSchema.parse(req.query)
			const userObject = await app.prisma.user.findUnique ({
				where: { username: query.username }
			})
			if (!userObject) {
				return res.status(404).send({error: 'username not found in database'})
			}
			
			const matches = await app.prisma.matchParticipant.findMany({
				where: {userId: userObject.id},
				include: {
					match: true
				}
			})
			return res.status(200).send({ matches })
		} catch(error) {
			return res.status(400).send({ message: 'Bad request', error: error })
		}
	})
}