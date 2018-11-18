import Options from './Options';

import EventDispatcher from './event/EventDispatcher';

import Physics from './physics/Physics';

import API from './api/API';

/**
 * 应用程序
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function Application(container, options) {

    // 容器
    this.container = container;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    // 配置
    this.options = new Options(options);

    // 事件
    this.event = new EventDispatcher(this);
    this.call = this.event.call.bind(this.event);
    this.on = this.event.on.bind(this.event);

    // 核心
    this.editor = new Editor(this); // 编辑器
    this.physics = new Physics(params);

    // Html5 Worker
    // var script = document.querySelector('script[src$="ShadowEditor.js" i]').src; // http://localhost:2000/dist/ShadowEditor.js
    // this.worker = new Worker(script);
}

// ------------------------- 程序控制 -------------------------------

Application.prototype.start = function () {
    // 启动事件 - 事件要在ui创建完成后启动
    this.event.start();

    this.call('appStart', this);
    this.call('appStarted', this);

    // 启动物体引擎
    this.physics.start();

    this.call('resize', this);

    this.log('程序启动成功。');
};

Application.prototype.stop = function () {
    this.call('appStop', this);
    this.call('appStoped', this);

    this.log('程序已经停止');

    this.event.stop();
};

// ----------------------- 记录日志  --------------------------------

Application.prototype.log = function (content) { // 普通日志
    this.call('log', this, content);
};

Application.prototype.warn = function (content) { // 警告日志
    this.call('log', this, content, 'warn');
};

Application.prototype.error = function (content) { // 错误日志
    this.call('log', this, content, 'error');
};

// API
Object.assign(Application.prototype, API.prototype);

export default Application;