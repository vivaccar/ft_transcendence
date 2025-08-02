import { FastifyInstance  } from "fastify";
import { email } from "zod";



// ESTA FUNCAO É REDIRECIONADA APÓS O USUARIO SE AUTENTICAR PELA API DO GOOGLE!
export async function googleCallback(app:FastifyInstance) {
    app.get('/auth/google/callback', async (request, reply) => {
    const token = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
        Authorization: `Bearer ${token.token.access_token}`,
        },
    })

    const userInfo = await userInfoResponse.json();
    const userEmail = userInfo.email

    const userExists = await app.prisma.user.findUnique({
      where: { email: userEmail },
    })

    console.log(userExists);
    if (!userExists) {
        const user = await app.prisma.user.create({
        data: {
          username: "undefined",
          email: userEmail,
          passwordHash: "undefined",
        },
      })
    }

    const jwtToken = app.jwt.sign(
      {
        sub: userExists.id,
        username: userExists.username,
      },
      { expiresIn: '7d' }
    );
    
    return reply.send({ message: 'Login successful', token: jwtToken, user: userInfo })
    })
}
