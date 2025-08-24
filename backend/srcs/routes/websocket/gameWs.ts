// backend/srcs/routes/websocket/gameWs.ts

import { FastifyInstance } from 'fastify';
import { GameSession, Player } from '../../game/engine'; // <--- IMPORTAMOS O NOSSO MOTOR DE JOGO

// Vamos guardar as sessões ativas em memória (isto será reiniciado se o servidor cair)
const sessions = new Map<string, GameSession>();
const pendingSessions = new Map<string, GameSession>();

function generateSessionId(): string {
    return Math.random().toString(36).substring(2, 9);
}

export default async function gameWs(app: FastifyInstance) {
  app.get('/ws', { websocket: true }, (connection, req) => {

	console.log('Cliente conectado ao WebSocket!');
	connection.send('Bem-vindo ao servidor de jogo!');
	// AQUIIIIIIIIIIIIIIIIIIIIIIII
	// PRECISO DESCOBRIR COMO BUSCAR O ID DO UTILIZADOS NO TOKEN!!!!
	// AQUIIIIIIIIIIIIIIIIIII, PARA ASSIM CONECTARMOS UM USER ESPECIFICO
    // Por agora, vamos usar um ID aleatório para teste.

    const userId = req.headers['sec-websocket-key']; //Aqui precisa buscar o ID do user no token JWT
	if (!userId) {
        connection.close(1011, 'Missing connection key: userId');
        return;
    }

    connection.on('message', (message: string) => {
      const data = JSON.parse(message.toString());

      switch (data.type) {
        case 'createMatch': {
          const sessionId = generateSessionId();
          const session = new GameSession(sessionId);
          const player1 = new Player(userId, connection, 'left');
          session.addPlayer(player1);

          pendingSessions.set(sessionId, session);
          
          const response = { type: 'matchCreated', sessionId };
          connection.send(JSON.stringify(response));
          break;
        }

        case 'joinMatch': {
          const sessionId = data.sessionId;
          const session = pendingSessions.get(sessionId);

          if (session && session.players.length === 1) {
            const player2 = new Player(userId, connection, 'right');
            session.addPlayer(player2);
            
            sessions.set(sessionId, session);
            pendingSessions.delete(sessionId);

            session.start();
          } else {
            // Sessão não encontrada ou já está cheia
            connection.send(JSON.stringify({ type: 'error', message: 'Session not found or full' }));
          }
          break;
        }

        case 'playerMove': {
          //AQUI É O PRÓXIMO PASSO
          break;
        }
      }
    });

    connection.on('close', () => {
      console.log('Cliente desconectado.');
      // Aqui teríamos de encontrar a sessão do jogador e lidar com a sua saída
    });
  });
}