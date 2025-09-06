import { FastifyInstance } from "fastify";

export async function userAvatar(app: FastifyInstance) {
    app.get('/users/:username/avatar',{ preHandler: [app.authenticate] }, async (request, reply) => {
        const { username } = request.params as { username: string }

        const user = await app.prisma.user.findUnique({
            where: { username: username },
            select: { avatar: true },
        });

        if (!user || !user.avatar) {
            return reply.status(404).send({ error: 'Avatar not found' });
        }

        reply
          .header('Content-Type', 'image/png')
          .send(user.avatar);
    });
}