import Fastify from "fastify"
import db from './plugins/db';
import { registerRoutes } from "./routes/register";
import { loginRoutes } from "./routes/login";

const app = Fastify()

app.register(db);
app.register(registerRoutes);
app.register(loginRoutes);

export default app