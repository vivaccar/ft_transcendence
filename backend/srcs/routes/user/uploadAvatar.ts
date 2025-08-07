import { FastifyInstance } from "fastify"
import { fileTypeFromBuffer } from 'file-type'
import { uploadAvatarSwaggerSchema } from "../../schemaSwagger/uploadAvatarSchema"

export async function uploadAvatar(app: FastifyInstance) {
	app.post('/uploadAvatar', { preHandler: [app.authenticate], schema: uploadAvatarSwaggerSchema }, async(req, res) => {
		const imgOptions = {limits: {
			fileSize: 10000000,
			files: 1,
			fieldNameSize: 100
		}}
    	try {
			const file = await req.file(imgOptions)
			
			if (!file) {
				return res.status(400).send({ error: "No file found"})
			}

			const buffer = await file.toBuffer()
			const fileType = await fileTypeFromBuffer(buffer)

			const allowedExtensions = ['jpg', 'jpeg', 'png']

			if (!fileType || !allowedExtensions.includes(fileType.ext)) {
				return res.status(415).send({ error: "Unsupported File Type"})
			}
			
			const userId = req.user.id
			
			const newAvatar = await app.prisma.user.update({
				where: {id: userId},
				data: { avatar: buffer }
			})
			return res.status(200).send({message: "New avatar uploaded"})
		} catch(err) {
			console.error(err)
			return res.status(400).send({error: err.message || "erro descohecido"})
		}
	})
}