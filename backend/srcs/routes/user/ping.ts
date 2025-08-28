import { FastifyInstance } from "fastify"

export async function ping(app: FastifyInstance) {
  app.post("/ping", { preHandler: [app.authenticate] }, async (request, reply) => {
    const user = request.user as { username: string } | undefined;

    if (!user) {
      return reply.status(200).send({ message: "User not found" });
    }

    try {
      const updatedUser = await app.prisma.user.update({
        where: { username: user.username },
        data: { lastPing: BigInt(Date.now()) },
      });
      console.log("\n\n PING REGISTRADO: ", updatedUser.lastPing.toString())
      return { message: "Ping registered" };
    } catch (err) {
      console.error("Error", err);
      return reply.status(200).send({ message: "pinging" });
    }
  });
}