import { FastifyInstance } from "fastify"

export async function uploadAvatar(app: FastifyInstance) {
	app.post('/uploadAvatar', async(req, res) => {
    	try {
			const image = await req.file()

			if (!image) {
				return res.status(400).send({ message: "No image found"})
			}
			const buffer = await image.toBuffer()
			
			const newAvatar = await app.prisma.user.update({
				where: {id: 1}, // futuramente criar forma de verificar o user que esta logado
				data: { avatar: buffer }
			})
			return res.status(200).send({message: "New avatar uploaded"})
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: "deu ruim"})
		}
	})
}