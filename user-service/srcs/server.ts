import fastify from "fastify";

const app = fastify()

app.get('/', () => {
	return "hello my friend!"
})

app.listen({port: 3333}).then(() =>{
	console.log("SERVER RUNNING!")
})