import { FastifyInstance } from "fastify";

export async function userAvatar(app: FastifyInstance) {
    app.get('/users/:id/avatar', async (request, reply) => {
        const userId = Number((request.params as { id: string }).id);

        if (isNaN(userId)) {
            return reply.status(400).send({ error: 'Invalid user id' });
        }

        const user = await app.prisma.user.findUnique({
            where: { id: userId },
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