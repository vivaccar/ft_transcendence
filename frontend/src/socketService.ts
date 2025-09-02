// frontend/src/socketService.ts

let socket: WebSocket | null = null;
let onMessageCallback: ((data: any) => void) | null = null;

export function connectWebSocket(callback: (data: any) => void) {
    // Evita múltiplas conexões
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('WebSocket já está conectado.');
        return;
    }

    onMessageCallback = callback;
    
    // NOTA: No futuro, aqui irás adicionar o token JWT à URL
    // ex: `ws://localhost:3002/ws?token=${your_jwt}`
    socket = new WebSocket('ws://localhost:3002/ws');

    socket.onopen = () => {
        console.log('WebSocket conectado com sucesso ao servidor.');
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (onMessageCallback) {
                onMessageCallback(data);
            }
        } catch (error) {
            console.error('Erro ao processar mensagem do servidor:', event.data);
        }
    };

    socket.onclose = () => {
        console.log('WebSocket desconectado.');
        socket = null;
    };

    socket.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
    };
}

export function sendMessage(message: object) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.error('Não é possível enviar mensagem, WebSocket não está conectado.');
    }
}