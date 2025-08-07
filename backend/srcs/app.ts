import Fastify from "fastify"
import dbPlugin from './plugins/dbPlugin';
import { registerRoutes } from "./authentication/routes/register";
import { loginRoutes } from "./authentication/routes/login";
import { googleCallback } from "./authentication/routes/googleCallback";
import { setup2fa } from "./authentication/routes/2fa";
import { enable2fa } from "./authentication/routes/2fa";
import { verify2fa } from "./authentication/routes/2fa";
import { disable2fa } from "./authentication/routes/2fa";
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
<<<<<<< HEAD
app.register(multipart);

=======
app.register(setup2fa)
app.register(enable2fa)
app.register(verify2fa)
app.register(disable2fa)
>>>>>>> 1bf11bd340617c1a9336e7cc04ec9f8777856f23
app.register(registerMatch);
app.register(getMatches);
app.register(uploadAvatar);

export default app