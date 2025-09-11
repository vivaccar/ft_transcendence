import { FastifyInstance } from "fastify"

export async function ping(app: FastifyInstance) {
  app.post("/ping", async (request, reply) => {
    let user: { id: number } | null = null;

    try {
      const payload = await request.jwtVerify({ onlyCookie: true });
      user = payload as { id: number };
    } catch {
      return reply.status(200).send({ message: "Ping ignored: user not logged in" });
    }

    try {
      const updatedUser = await app.prisma.user.update({
        where: { id: user.id },
        data: { lastPing: BigInt(Date.now()) },
      });
      console.log("\n\n PING REGISTRADO: ", updatedUser.lastPing.toString())
      return { message: "Ping registered" };
    } catch (err) {
      console.error("Error updating ping", err);
      return reply.status(200).send({ message: "Ping continues" });
    }
  });
}