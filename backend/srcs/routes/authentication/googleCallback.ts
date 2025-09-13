import { FastifyInstance } from "fastify";
import { googleCallbackSwaggerSchema } from "../../schemaSwagger/googleCallbackSchema";

// Google redirect
export async function googleCallback(app: FastifyInstance) {
  app.get(
    "/auth/google/callback",
    { schema: googleCallbackSwaggerSchema },
    async (request, reply) => {
      const token = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
        request
      );

      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token.token.access_token}`,
          },
        }
      );

      const userInfo = await userInfoResponse.json();
      const userEmail = userInfo.email;

      let user = await app.prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        let baseUsername = userInfo.name
          ? userInfo.name.replace(/\s+/g, "").toLowerCase()
          : "user";

        let uniqueUsername = baseUsername;
        let counter = 1;

        while (
          await app.prisma.user.findUnique({ where: { username: uniqueUsername } })
        ) {
          uniqueUsername = `${baseUsername}${counter}`;
          counter++;
        }

        user = await app.prisma.user.create({
          data: {
            username: uniqueUsername,
            email: userEmail,
            passwordHash: null,
          },
        });
      }

      if (user.has2fa) {
        const jwtToken = app.jwt.sign(
          {
            id: user.id,
            partialToken: true,
          },
          { expiresIn: "3m" }
        );

        reply
          .setCookie("token", jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
          })
          .setCookie("has2fa", "true", {
            httpOnly: false, // front can read
            secure: true,
            sameSite: "lax",
            path: "/",
          })          
          .setCookie("google", "true", {
            httpOnly: false, // front can read
            secure: true,
            sameSite: "lax",
            path: "/",
          })

        return reply.redirect("https://localhost:8443/dashboard");
      }

      const jwtToken = app.jwt.sign(
        {
          id: user.id,
          partialToken: false,
        },
        { expiresIn: "7d" }
      );

      reply
        .setCookie("token", jwtToken, {
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

      return reply.redirect("https://localhost:8443/dashboard");
    }
  );
}