let socket: WebSocket | null = null;
let onMessageCallback: ((data: any) => void) | null = null;

export function connectWebSocket(callback: (data: any) => void) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('O WebSocket já está conectado.');
        return;
    }

    onMessageCallback = callback;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host; 
    const socketURL = `${protocol}://${host}/ws/`;

    console.log(`A tentar conectar ao WebSocket via proxy em: ${socketURL}`);
    socket = new WebSocket(socketURL);

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

// ADIÇÃO NECESSÁRIA
export function disconnectWebSocket() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('A desconectar o WebSocket intencionalmente...');
        socket.close(1000, "User initiated disconnect");
        socket = null;
    }
}