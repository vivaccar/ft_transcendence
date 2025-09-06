import { FastifyInstance } from "fastify";
import { meSwaggerSchema } from "../../schemaSwagger/meSchema";

export async function me(app: FastifyInstance) {
    app.get("/me", { preHandler: [app.authenticate], schema: meSwaggerSchema },async(request, reply) => {
        
        const user = await app.prisma.user.findUnique({
            where: { id: request.user.id },
        });

        if (!user) {
            return reply.status(400).send({message: "User not found"})
        }
        
        const backendUrl = process.env.BACKEND_URL
        // const avatarUrl = `${backendUrl}/users/${user.username}/avatar`;
        // const avatarUrl = `${backendUrl}/users/${user.username}/avatar`;
        const avatarUrl = user.avatar
            ? `${backendUrl}/users/${user.username}/avatar`
            : `/images/randomAvatar/0.jpeg`;
        if (user.passwordHash) {
            var googleUser = false
        }
        else {
            googleUser = true
        }

        return reply.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            language: user.language,
            avatar: avatarUrl,
            googleUser: googleUser
        })
    })
}