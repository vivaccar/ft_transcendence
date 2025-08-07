import { FastifyInstance  } from "fastify";
import { email } from "zod";
import { googleCallbackSwaggerSchema } from "../../schemas/googleCallbackSchema";



// ESTA FUNCAO É REDIRECIONADA APÓS O USUARIO SE AUTENTICAR PELA API DO GOOGLE!
export async function googleCallback(app: FastifyInstance) {
  app.get('/auth/google/callback', { schema: googleCallbackSwaggerSchema } ,async (request, reply) => {
    const token = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${token.token.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();
    const userEmail = userInfo.email;

    let user = await app.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      user = await app.prisma.user.create({
        data: {
          username: userInfo.name || "undefined",
          email: userEmail,
          passwordHash: "undefined", // ou null se permitido no schema
        },
      });
    }

    if (user.has2fa) {
      const jwtToken = app.jwt.sign({
        id: user.id,
        username: user.username,
        partialToken: true
      },
      { expiresIn: '3m'})
      return reply.status(200).send({ token: jwtToken, has2fa: true });
    }

    const jwtToken = app.jwt.sign(
      {
        id: user.id,
        username: user.username,
        partialToken: false
      },
      { expiresIn: '7d' }
    );

    return reply.status(200).send({ token: jwtToken, has2fa: false });
  });
}