import { FastifyInstance } from "fastify"
import { compare, hash } from "bcryptjs"
import { updatePasswordSchema } from "../../schemaSwagger/passwordUpdateSchema"

export async function updatePassword(app: FastifyInstance) {
    app.patch("/user/password", { preHandler: [app.authenticate], schema: updatePasswordSchema }, async (request, reply) => {
        const { oldPassword, newPassword } = request.body as { oldPassword: string, newPassword: string }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        if (!passwordRegex.test(newPassword)) {
            return reply.status(400).send({ 
                message: "New password must be at least 8 characters long and contain at least one letter and one number" 
            })
        }
            
        const user = await app.prisma.user.findUnique({
            where: { id: request.user.id },
        })

        if (!user) {
            return reply.status(404).send({ message: "User not found" })
        }

        const isPasswordValid = await compare(oldPassword, user.passwordHash)
        if (!isPasswordValid) {
            return reply.status(401).send({ message: "Old password is incorrect" })
        }

        const hashedPassword = await hash(newPassword, 10)

        await app.prisma.user.update({
            where: { id: request.user.id },
            data: { passwordHash: hashedPassword },
        })

        return reply.status(200).send({ message: "Password successfully updated" })
    })
}