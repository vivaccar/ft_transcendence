import Fastify from "fastify"
import dbPlugin from './plugins/dbPlugin';
import { registerRoutes } from "./routes/register";
import { loginRoutes } from "./routes/login";
import jwt from "./plugins/jwtPlugin";
import jwtPlugin from "./plugins/jwtPlugin";

const app = Fastify()

app.register(dbPlugin);
app.register(jwtPlugin);
app.register(registerRoutes);
app.register(loginRoutes);

export default app