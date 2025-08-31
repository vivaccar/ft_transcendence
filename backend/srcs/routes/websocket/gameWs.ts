// backend/srcs/routes/websocket/gameWs.ts (VERSÃO DEFINITIVA)

import { FastifyInstance, FastifyRequest } from 'fastify';
import { WebSocket } from 'ws'; // <--- 1. IMPORTAMOS O TIPO 'WebSocket'
import { GameSession, Player } from '../../game/engine';

const sessions = new Map<string, GameSession>();
const connectionToSessionMap = new Map<WebSocket, string>(); // Usamos o tipo correto para o mapa

function generateSessionId(): string {
	return Math.random().toString(36).substring(2, 9);
}

export default async function gameWs(app: FastifyInstance) {
	// 2. ADICIONAMOS A TIPAGEM EXPLÍCITA PARA 'connection'
	app.get('/ws', { websocket: true }, (connection: WebSocket, req: FastifyRequest) => {

		console.log("Conectado!");
		const userId = req.headers['sec-websocket-key'];
		if (!userId) {
			connection.close(1011, 'Missing connection key');
			return;
		}

		connection.on('message', (message: string) => {
			console.log('--- MENSAGEM BRUTA RECEBIDA ---');
			console.log(message.toString());
			console.log('-------------------------------');

			const data = JSON.parse(message.toString());

			switch (data.type) {
				case 'createMatch': {
					console.log("createMatch!", data.payload);
					const sessionId = generateSessionId();
					const background = data.payload?.background;
					const session = new GameSession(sessionId, background);
					// 3. A CORREÇÃO: Passamos 'connection' diretamente
					const playerColor = data.payload?.color || 'white';
					const player1 = new Player(userId, connection, 'left', playerColor);
					session.addPlayer(player1);

					sessions.set(sessionId, session);
					connectionToSessionMap.set(connection, sessionId);

					const response = { type: 'matchCreated', sessionId };
					connection.send(JSON.stringify(response));
					console.log(`Partida ${sessionId} criada pelo jogador ${userId} com a cor ${playerColor}.`);
					break;
				}

				case 'joinMatch': {
					console.log("joinMatch!", data.payload);
					const sessionId = data.payload?.sessionId;
					const playerColor = data.payload?.color || 'white';

					if (!sessionId) {
                        console.error("Erro: 'joinMatch' sem sessionId no payload.");
                        connection.send(JSON.stringify({ type: 'error', message: 'Match ID is missing.' }));
                        return;
                    }

					const session = sessions.get(sessionId);
					if (session && session.players.length === 1) {
						// 3. A CORREÇÃO: Passamos 'connection' diretamente
						const player2 = new Player(userId, connection, 'right', playerColor);
						session.addPlayer(player2);
						connectionToSessionMap.set(connection, sessionId);
						session.start();
					} else {
						connection.send(JSON.stringify({ type: 'error', message: 'Session not found or full' }));
					}
					break;
				}

				case 'playerMove': {
					console.log("playerMove!"); // Este log agora vai funcionar!
					const sessionId = connectionToSessionMap.get(connection);
					if (sessionId) {
						const session = sessions.get(sessionId);
						// Passamos apenas o 'payload' com os detalhes do movimento
						session?.handlePlayerMove(userId, data.payload);
					}
					break;
				}
			}
		});

		connection.on('close', () => {
			const sessionId = connectionToSessionMap.get(connection);
			if (sessionId) {
				const session = sessions.get(sessionId);
				if (session) {
					session.removePlayer(userId);
					if (session.players.length === 0) {
						sessions.delete(sessionId);
						console.log(`Sessão ${sessionId} removida.`);
					}
				}
				connectionToSessionMap.delete(connection);
			}
		});
	});
}