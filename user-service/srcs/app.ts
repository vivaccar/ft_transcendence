import Fastify from "fastify"
import dbPlugin from './dbPlugin' 
import { registerMatch } from "./routes/registerMatch";

const app = Fastify()

app.register(dbPlugin);
app.register(registerMatch);

export default app