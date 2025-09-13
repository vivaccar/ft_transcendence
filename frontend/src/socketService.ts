let socket: WebSocket | null = null;
let onMessageCallback: ((data: any) => void) | null = null;

export function connectWebSocket(callback: (data: any) => void) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        return;
    }

    onMessageCallback = callback;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host; 
    const socketURL = `${protocol}://${host}/ws/`;
    socket = new WebSocket(socketURL);

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (onMessageCallback) {
                onMessageCallback(data);
            }
        } catch (error) {
            console.error('Error! Bad server processing:', event.data);
        }
    };

    socket.onclose = () => {
        socket = null;
    };

    socket.onerror = (error) => {
        console.error('Error! Websocket Error:', error);
    };
}

export function sendMessage(message: object) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.error('Error! Not possible to send message to server. Websocket not connected.');
    }
}

export function disconnectWebSocket() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close(1000, "User initiated disconnect");
        socket = null;
    }
}