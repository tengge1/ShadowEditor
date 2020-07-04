/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseEvent from './BaseEvent';

/**
 * WebSocket事件
 * @author tengge / https://github.com/tengge1
 */
class WebSocketEvent extends BaseEvent {
    constructor() {
        super();

        this.reconnectTime = 5000; // 重新连接时间

        this.handleSend = this.handleSend.bind(this);

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

        app.on(`send.${this.id}`, this.handleSend);

        this.socket.addEventListener('open', this.onOpen);
        this.socket.addEventListener('message', this.onMessage);
        this.socket.addEventListener('error', this.onError);
        this.socket.addEventListener('close', this.onClose);
    }

    stop() {
        if (!this.socket) {
            return;
        }

        app.on(`send.${this.id}`, null);

        this.socket.removeEventListener('open', this.onOpen);
        this.socket.removeEventListener('message', this.onMessage);
        this.socket.removeEventListener('error', this.onError);
        this.socket.removeEventListener('close', this.onClose);
    }

    reconnect() {
        this.stop();
        this.start();
    }

    /**
     * 通过WebSocket向服务端发送消息
     * @param {Object} obj 数据
     * @param {String} obj.type 消息类型
     */
    handleSend(obj) {
        if (!this.socket) {
            return;
        }
        if (this.socket.readyState !== this.socket.OPEN) {
            this.reconnect();
            return;
        }
        this.socket.send(JSON.stringify(obj));
    }

    onOpen() {
        console.log('WebSocket open successfully.');
    }

    onMessage(event) {
        console.log('WebSocket message received.', event.data);
    }

    onError(event) {
        console.warn('WebSocket Error:', event);
        setTimeout(() => {
            this.reconnect();
        }, this.reconnectTime);
    }

    onClose() {
        console.log('WebSocket closed.');
        setTimeout(() => {
            this.reconnect();
        }, this.reconnectTime);
    }
}

export default WebSocketEvent;