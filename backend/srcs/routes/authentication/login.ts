import { FastifyInstance } from "fastify";
import { compare } from "bcryptjs";
import { z } from "zod";
import { loginSwaggerSchema } from "../../schemaSwagger/loginSchema";

export async function loginRoutes(app: FastifyInstance) {
  app.post(
    "/auth/login",
    { schema: loginSwaggerSchema },
    async (request, reply) => {
      const loginBody = z.object({
        username: z.string(),
        password: z.string(),
      });

      let username: string;
      let password: string;
      try {
        ({ username, password } = loginBody.parse(request.body));
      } catch (error) {
        return reply.status(400).send({ message: "Bad request" });
      }

      const user = await app.prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return reply.status(400).send({ message: "Invalid username" });
      }

      if (!(await compare(password, user.passwordHash))) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }

      if (user.has2fa) {
        const token = app.jwt.sign(
          {
            id: user.id,
            partialToken: true,
          },
          { expiresIn: "3m" }
        );

        reply
          .setCookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
          })
          .setCookie("has2fa", "true", {
            httpOnly: false, // pode ser lido pelo frontend
            secure: true,
            sameSite: "lax",
            path: "/",
          });

        return reply.status(200).send({ message: "2FA required" });
      }

      const token = app.jwt.sign(
        {
          id: user.id,
          partialToken: false,
        },
        { expiresIn: "7d" }
      );

      reply
        .setCookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
        })
        .setCookie("has2fa", "false", {
          httpOnly: false,
          secure: true,
          sameSite: "lax",
          path: "/",
        });

      return reply.status(200).send({ message: "Login successful" });
    }
  );
}