import Fastify from "fastify"
import dbPlugin from './plugins/dbPlugin';
import { registerRoutes } from "./routes/authentication/register";
import { loginRoutes } from "./routes/authentication/login";
import { googleCallback } from "./routes/authentication/googleCallback";
import { setup2fa } from "./routes/authentication/2fa";
import { enable2fa } from "./routes/authentication/2fa";
import { verify2fa } from "./routes/authentication/2fa";
import { disable2fa } from "./routes/authentication/2fa";
import { registerMatch } from "./routes/stats/registerMatch";
import { uploadAvatar } from "./routes/user/uploadAvatar";
import { getMatches } from "./routes/stats/getMatches";
import { getWinsAndLosses } from "./routes/stats/getWinsAndLosses";
import { getGoals } from "./routes/stats/getGoals";
import { me } from "./routes/user/me";
import { userAvatar } from "./routes/user/getUserAvatar";
import { updateUsername } from "./routes/user/updateUsername";
import { updatePassword } from "./routes/user/changePassword";
import { logout } from "./routes/authentication/logout";
import { inviteFriend } from "./routes/friendships/inviteFriend";
import { getInvites } from "./routes/friendships/getInvites";
import { acceptInvite } from "./routes/friendships/acceptInvite";
import { declineInvite } from "./routes/friendships/declineInvite";
import { unfriend } from "./routes/friendships/unfriend";
import { getFriends } from "./routes/friendships/getFriends";
import { ping } from "./routes/user/ping";
import jwt from "./plugins/jwtPlugin";
import jwtPlugin from "./plugins/jwtPlugin";
import googleOAuthPlugin from './plugins/google-oauth'
import googleOauth from "./plugins/google-oauth";
import fastifyCookie from '@fastify/cookie'
import swaggerPlugin from "./plugins/swaggerPlugin";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import websocket from '@fastify/websocket';
import gameWs from './routes/websocket/gameWs';

const app = Fastify({ logger: true,  trustProxy: true })

app.register(cors, {
  origin: ['https://localhost', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});

/* app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET!,
}) */
app.register(swaggerPlugin)
app.register(dbPlugin);
app.register(jwtPlugin);
app.register(googleOauth);
app.register(registerRoutes);
app.register(loginRoutes);
app.register(googleCallback);
app.register(multipart), {
	limits: {
		fileSize: 10000000,

	}
};
app.register(setup2fa);
app.register(enable2fa);
app.register(verify2fa);
app.register(disable2fa);
app.register(registerMatch);
app.register(getMatches);
app.register(getWinsAndLosses);
app.register(getGoals);
app.register(uploadAvatar);
app.register(userAvatar);
app.register(updateUsername);
app.register(updatePassword);
app.register(logout);
app.register(me);
app.register(inviteFriend)
app.register(getInvites)
app.register(acceptInvite)
app.register(declineInvite)
app.register(unfriend)
app.register(getFriends)
app.register(ping);
app.register(websocket);
app.register(gameWs);

export default app