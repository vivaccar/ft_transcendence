import { FastifyInstance } from "fastify"

export async function logout(app: FastifyInstance) {
    app.post("/auth/logout", { preHandler: [app.authenticate] }, async (request, reply) => {
        reply
            .setCookie("token", "", {
                path: "/",
                httpOnly: true,
                sameSite: "lax",
                secure: true,
                maxAge: 0,
            })
            .status(200)
            .send({ message: "Logged out successfully" })
    })
}