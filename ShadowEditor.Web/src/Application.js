import { Toast } from './third_party';
import Options from './Options';
import Storage from './utils/Storage';
import PackageManager from './package/PackageManager';
import EventDispatcher from './event/EventDispatcher';
import Editor from './editor2/Editor.jsx';

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

    window.app = this;

    // 配置
    this.options = new Options(options);

    // 存储
    this.storage = new Storage();

    // 包管理器
    this.packageManager = new PackageManager();
    this.require = this.packageManager.require.bind(this.packageManager);

    // 事件
    this.event = new EventDispatcher(this);
    this.call = this.event.call.bind(this.event);
    this.on = this.event.on.bind(this.event);

    this.event.start();

    // UI
    this.ui = React.createElement(Editor);
    ReactDOM.render(this.ui, this.container);
}

// ----------------------- 弹出窗口 ---------------------------------

Application.prototype.toast = function (text) {
    var toast = React.createElement(Toast, undefined, text);
    this.editor.addComponent(toast);
    setTimeout(() => {
        this.editor.removeComponent(toast);
    }, 5000);
};

Application.prototype.alert = function (text, callback) {

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

export default Application;