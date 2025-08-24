import { FastifyInstance } from 'fastify';

export default async function gameWs(app: FastifyInstance) {
	app.get('/ws', { websocket: true }, (connection /*, req */) => {
		// A 'connection' é o objeto que representa a conexão com um cliente (browser)
		const socket = connection;

		console.log('Cliente conectado ao WebSocket!');
		socket.send('Bem-vindo ao servidor de jogo!');

		// Fica à escuta por mensagens vindas deste cliente
		socket.on('message', (message : string) => {
			// O 'message' chega como um Buffer, convertemos para string
			const receivedMessage = message.toString();

			console.log(`Mensagem recebida do cliente: ${receivedMessage}`);

			// Envia uma resposta de volta para o cliente
			socket.send(`Servidor ouviu a tua mensagem: "${receivedMessage}"`);
		});

		// Fica à escuta para quando o cliente se desconectar
		socket.on('close', () => {
			console.log('Cliente desconectado.');
		});
	});
}