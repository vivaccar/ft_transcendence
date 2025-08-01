import app from './app'

app.get('/', async (req, res) => {
	return "hello my friend!"
})

app.listen({port: 3333}).then(() =>{
	console.log("SERVER RUNNING!")
})
