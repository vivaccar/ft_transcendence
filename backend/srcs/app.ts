import Fastify from "fastify"
import dbPlugin from './plugins/dbPlugin';
import { registerRoutes } from "./authentication/routes/register";
import { loginRoutes } from "./authentication/routes/login";
import { googleCallback } from "./authentication/routes/googleCallback";
import { registerMatch } from "./user/routes/registerMatch";
import { uploadAvatar } from "./user/routes/uploadAvatar";
import { getMatches } from "./user/routes/getMatches";
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
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
app.register(multipart);

app.register(registerMatch);
app.register(getMatches);
app.register(uploadAvatar);

export default app