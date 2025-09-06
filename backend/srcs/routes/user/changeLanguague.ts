import { FastifyInstance } from "fastify"
import { updateLanguageSchema } from "../../schemaSwagger/updateLanguageSchema"

export async function updateLanguage(app: FastifyInstance) {
    app.patch("/user/language", { preHandler: [app.authenticate] , schema: updateLanguageSchema}, async (request, reply) => {
        const { newLanguage } = request.body as { newLanguage: string }

        if (!["PT", "FR", "EN"].includes(newLanguage)) {
            return reply.status(400).send({ message: "Invalid Language" })
        }

        
        const user = await app.prisma.user.findUnique({
            where: { id: request.user.id },
        })

        if (!user) {
            return reply.status(404).send({ message: "User not found" })
        }

        const updatedUser = await app.prisma.user.update({
            where: { id: request.user.id },
            data: { language: newLanguage },
        })

        return reply.status(200).send({ message: "Language succesfully updated" })
    })
}
