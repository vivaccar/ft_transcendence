import { FastifyInstance  } from "fastify";

export async function googleCallback(app:FastifyInstance) {
    app.get('/auth/google/callback', async (request, reply) => {
    const token = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
        Authorization: `Bearer ${token.token.access_token}`,
        },
    })

    const userInfo = await userInfoResponse.json()


    return reply.send({ message: 'Login successful', user: userInfo })
    })
}