import { FastifyInstance } from "fastify"
import { updateUsernameSchema } from "../../schemaSwagger/usernameUpdateSchema"

export async function updateUsername(app: FastifyInstance) {
    app.patch("/user/username", { preHandler: [app.authenticate] , schema: updateUsernameSchema}, async (request, reply) => {
        const { newUsername } = request.body as { newUsername: string }

        if (!newUsername || newUsername.trim().length < 3 || newUsername.trim().length > 15) {
            return reply.status(400).send({ message: "Username must have at least 3 and maximum 15 characters" })
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(newUsername)) {
            return reply.status(400).send({ message: "Username contains invalid characters" });
        }
        
        const user = await app.prisma.user.findUnique({
            where: { id: request.user.id },
        })

        if (!user) {
            return reply.status(404).send({ message: "User not found" })
        }
        const usernameTaken = await app.prisma.user.findUnique({
            where: { username: newUsername },
        })

        if (usernameTaken) {
            return reply.status(409).send({ message: "Username already taken" })
        }

        const updatedUser = await app.prisma.user.update({
            where: { id: request.user.id },
            data: { username: newUsername },
        })

        return reply.status(200).send({ message: "Username succesfully updated" })
    })
}
