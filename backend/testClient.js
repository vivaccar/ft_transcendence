import WebSocket from 'ws';
import readline from 'readline';

// --- CONFIGURAÇÃO ---
const SERVER_URL = 'ws://localhost:3002/ws';
const playerType = process.argv[2];

if (!['host', 'guest'].includes(playerType)) {
    console.error("Uso: node testClient.js <host|guest>");
    process.exit(1);
}

const ws = new WebSocket(SERVER_URL);

// --- LÓGICA DE CONEXÃO E MENSAGENS ---
ws.on('open', () => {
    console.log(`Conectado como ${playerType}.`);
    if (playerType === 'host') {
        ws.send(JSON.stringify({ type: 'createMatch' }));
    } else {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question('Insira o ID da Sessão: ', (sessionId) => {
            ws.send(JSON.stringify({ type: 'joinMatch', sessionId }));
        });
    }
});

ws.on('message', (data) => {
    const message = JSON.parse(data);
    if (message.type === 'gameStateUpdate') {
        if (Date.now() % 1000 < 50) {
            const p1y = message.paddles[0]?.y?.toFixed(2) || 'N/A';
            const p2y = message.paddles[1]?.y?.toFixed(2) || 'N/A';
            console.log(`Scores: P1=${message.scores.p1} P2=${message.scores.p2} | Ball Y: ${message.ball.y.toFixed(2)} | P1 Y: ${p1y} | P2 Y: ${p2y}`);
        }
    } else {
        console.log('<< SERVER:', message);
        if (message.type === 'matchCreated') {
            console.log(`\n### Partida criada! Partilhe este ID: ${message.sessionId} ###\n`);
        }
    }
});

ws.on('close', (code) => console.log(`Desconectado. Código: ${code}`));
ws.on('error', (err) => console.error('Erro:', err.message));

// --- LÓGICA DE INPUT DO TECLADO ---
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

console.log(`A controlar como ${playerType}. Use as teclas apropriadas para mover. Pressione 'x' para sair.`);
process.stdin.on('keypress', (str, key) => {
    if (key.name === 'x' || (key.ctrl && key.name === 'c')) {
        ws.close();
        process.exit();
    }
    
    const hostKeys = ['w', 's'];
    const guestKeys = ['up', 'down'];
    const activeKeys = (playerType === 'host') ? hostKeys : guestKeys;
    
    if (activeKeys.includes(key.name)) {
        let keyToSend = key.name;
        if (key.name === 'up') keyToSend = 'ArrowUp';
        if (key.name === 'down') keyToSend = 'ArrowDown';

        // A MENSAGEM ESTRUTURADA CORRETAMENTE
        const moveMsg = { 
            type: 'playerMove',
            payload: {
                key: keyToSend, 
                keyState: 'keydown'
            }
        };
        console.log('>> A ENVIAR MOVIMENTO:', moveMsg);
        ws.send(JSON.stringify(moveMsg));

        setTimeout(() => {
            const stopMsg = { ...moveMsg, payload: { ...moveMsg.payload, keyState: 'keyup' } };
            ws.send(JSON.stringify(stopMsg));
        }, 150);
    }
});
