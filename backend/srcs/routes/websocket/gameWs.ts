import fastify, { FastifyInstance, FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';
import { GameSession } from '../../game/engine';
import { Player } from '../../game/entities/Player';

const sessions = new Map<string, GameSession>();
const connectionToSessionMap = new Map<WebSocket, string>();

function generateSessionId(): string {
    return Math.random().toString(36).substring(2, 9);
}

function handlePlayerExit(connection: WebSocket, userId: string) {
    const sessionId = connectionToSessionMap.get(connection);
    if (!sessionId) 
        return;

    const session = sessions.get(sessionId);
    if (!session) 
        return;

    session.removePlayer(userId);

    if (session.players.length === 0) {
        sessions.delete(sessionId);
    }
    
    connectionToSessionMap.delete(connection);
}

export default async function gameWs(app: FastifyInstance) {
    app.get('/ws', { websocket: true }, (connection: WebSocket, req: FastifyRequest) => {

        const userId = req.headers['sec-websocket-key'] as string;
        if (!userId) {
            connection.close(1011, 'Missing connection key');
            return;
        }

        connection.on('message', (message: string) => {
            const data = JSON.parse(message.toString());

            switch (data.type) {
                case 'createMatch': {
                    const sessionId = generateSessionId();
                    const background = data.payload?.background;
                    const session = new GameSession(sessionId, background, app.prisma);
                    const playerColor = data.payload?.color || 'white';
                    const playerName = data.payload?.playerName || 'Host'
                    const player1 = new Player(userId, playerName, connection, 'left', playerColor);
                    session.addPlayer(player1);

                    sessions.set(sessionId, session);
                    connectionToSessionMap.set(connection, sessionId);

                    const response = { type: 'matchCreated', sessionId };
                    connection.send(JSON.stringify(response));
                    break;
                }

                case 'joinMatch': {
                    const sessionId = data.payload?.sessionId;
                    const playerName = data.payload?.playerName || "Guest";
                    const playerColor = data.payload?.color || 'white';

                    if (!sessionId) {
                        connection.send(JSON.stringify({ type: 'error', message: 'Match ID is missing.' }));
                        return;
                    }

                    const session = sessions.get(sessionId);
                    if (session && session.players.length === 1) {
                        const player2 = new Player(userId, playerName, connection, 'right', playerColor);
                        if (session.players[0].name === playerName) {
                            connection.send(JSON.stringify({ type: 'error', message: 'You Cannot join this match' }));
                            return;
                        }
                        session.addPlayer(player2);
                        connectionToSessionMap.set(connection, sessionId);
                        session.start();
                    } else {
                        connection.send(JSON.stringify({ type: 'error', message: 'Session not found or full' }));
                    }
                    break;
                }

                case 'playerMove': {
                    const sessionId = connectionToSessionMap.get(connection);
                    if (sessionId) {
                        const session = sessions.get(sessionId);
                        session?.handlePlayerMove(userId, data.payload);
                    }
                    break;
                }

                case 'player_left_game': {
                    console.log("player_left_game");
                    handlePlayerExit(connection, userId);
                    break;
                }
            }
        });

        connection.on('close', () => {
            handlePlayerExit(connection, userId);
        });
    });
}