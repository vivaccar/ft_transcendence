import Fastify from "fastify"
import dbPlugin from './dbPlugin' 
import { registerMatch, registerUser } from "./routes/register";

const app = Fastify()

app.register(dbPlugin);
app.register(registerMatch, registerUser);

export default app