import { FastifyInstance  } from "fastify";
import { email } from "zod";



// ESTA FUNCAO É REDIRECIONADA APÓS O USUARIO SE AUTENTICAR PELA API DO GOOGLE!
export async function googleCallback(app: FastifyInstance) {
  app.get('/auth/google/callback', async (request, reply) => {
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

    const jwtToken = app.jwt.sign(
      {
        sub: user.id,
        username: user.username,
      },
      { expiresIn: '7d' }
    );

    return reply.status(200).send({ token: jwtToken, user: userInfo });
  });
}