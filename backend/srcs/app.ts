import Fastify from "fastify"
import dbPlugin from './plugins/dbPlugin';
import { registerRoutes } from "./routes/authentication/register";
import { loginRoutes } from "./routes/authentication/login";
import { googleCallback } from "./routes/authentication/googleCallback";
import { setup2fa } from "./routes/authentication/2fa";
import { enable2fa } from "./routes/authentication/2fa";
import { verify2fa } from "./routes/authentication/2fa";
import { disable2fa } from "./routes/authentication/2fa";
import { registerMatch } from "./routes/user/registerMatch";
import { uploadAvatar } from "./routes/user/uploadAvatar";
import { getMatches } from "./routes/user/getMatches";
import { me } from "./routes/user/me";
import { userAvatar } from "./routes/user/getUserAvatar";
import jwt from "./plugins/jwtPlugin";
import jwtPlugin from "./plugins/jwtPlugin";
import googleOAuthPlugin from './plugins/google-oauth'
import googleOauth from "./plugins/google-oauth";
import fastifyCookie from '@fastify/cookie'
import swaggerPlugin from "./plugins/swaggerPlugin";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

const app = Fastify({ logger: true })

app.register(cors, {
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET!,
})
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
app.register(setup2fa)
app.register(enable2fa)
app.register(verify2fa)
app.register(disable2fa)
app.register(registerMatch);
app.register(getMatches);
app.register(uploadAvatar);
app.register(userAvatar)
app.register(me)

export default app