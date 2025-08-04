import { FastifyInstance } from "fastify"
import { z } from 'zod'

export async function getMatches(app: FastifyInstance) {
	app.get('/getMatches', async(req, res) => {
		const usernameSchema = z.string()	
		try {
      		const user = usernameSchema.parse(req.body) // faz o parse do request body, deixando o corpo da requisicao tipado e seguro para ser utilizado
			  
			const matches = app.prisma.
			/* return res.status(201).send({matchId: match.id, playerOne: match.matchParticipant[0].user.username, playerTwo: match.matchParticipant[1].user.username})
			} catch (error) {
			   return reply.status(400).send({ message: 'Bad request' })
		 }
		} catch(err) {
			console.error(err)
			return res.status(200).send({error: err})
		}
	})
} */