import BaseEvent from './BaseEvent';

/**
 * WebSocket事件
 * @author tengge / https://github.com/tengge1
 */
class WebSocketEvent extends BaseEvent {
    constructor() {
        super();

        this.reconnectTime = 5000; // 重新连接时间

        this.onOpen = this.onOpen.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onError = this.onError.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    start() {
        if (!app.server.enableRemoteEdit) {
            return;
        }

        let url = `ws://${new URL(app.options.server).hostname}:${app.server.webSocketServerPort}/RemoteEdit`;

        try {
            this.socket = new WebSocket(url);
        } catch (e) {
            console.warn(e);
        }

        this.socket.addEventListener('open', this.onOpen);
        this.socket.addEventListener('message', this.onMessage);
        this.socket.addEventListener('error', this.onError);
        this.socket.addEventListener('close', this.onClose);
    }

    stop() {
        if (!this.socket) {
            return;
        }
        this.socket.removeEventListener('open', this.onOpen);
        this.socket.removeEventListener('message', this.onMessage);
        this.socket.removeEventListener('error', this.onError);
        this.socket.removeEventListener('close', this.onClose);
    }

    onOpen(event) {
        console.log('WebSocket open successfully.');
    }

    onMessage(event) {
        console.log('WebSocket message received.');
    }

    onError(event) {
        console.warn('WebSocket Error:', event);
    }

    onClose(event) {
        console.log('WebSocket closed.');
    }
}

export default WebSocketEvent;