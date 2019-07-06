import {
    Toast,
    Alert,
    Confirm,
    Prompt
} from './third_party';
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

Application.prototype.toast = function (content) {
    let component = React.createElement(Toast, undefined, content);

    this.editor.addComponent(component);

    setTimeout(() => {
        this.editor.removeComponent(component);
    }, 5000);
};

/**
 * 提示信息
 * @param {Object} options 配置
 * @param {String} options.title 标题
 * @param {String} options.content 内容
 * @param {String} options.className 样式类
 * @param {Object} options.style 样式
 * @param {Function} options.onOK 点击确定回调函数
 * @param {Function} options.onClose 点击关闭回调函数
 */
Application.prototype.alert = function (options = {}) {
    let { title, content, className, style, onOK, onClose } = options;
    let component;

    let close = () => {
        component && this.editor.removeComponent(component);
    };

    if (onOK === undefined && onClose === undefined) {
        onOK = onClose = close;
    } else if (onClose === undefined) {
        onClose = onOK;
    }

    component = React.createElement(Alert, {
        title,
        okText: L_OK,
        className,
        style,
        onOK,
        onClose,
    }, content);

    this.editor.addComponent(component);

    return {
        component,
        close,
    };
};

Application.prototype.confirm = function (title, content, onOK, onCancel) {
    let component;

    let close = () => {
        component && this.editor.removeComponent(component);
    };

    let handleOK = () => {
        if (onOK && onOK() !== false) {
            close();
        }
    };

    if (onCancel === undefined) {
        onCancel = close;
    }

    component = React.createElement(Confirm, {
        title,
        okText: L_OK,
        cancelText: L_CANCEL,
        onOK: handleOK,
        onCancel,
        onClose: onCancel,
    }, content);

    this.editor.addComponent(component);

    return {
        component,
        close,
    };
};

Application.prototype.prompt = function (title, content, value, onOK, onClose) {
    let component;

    let close = () => {
        component && this.editor.removeComponent(component);
    };

    let handleOK = value => {
        if (onOK && onOK(value) !== false) {
            close();
        }
    };

    if (onClose === undefined) {
        onClose = close;
    }

    component = React.createElement(Prompt, {
        title,
        content,
        value,
        okText: L_OK,
        onOK: handleOK,
        onClose,
    });

    this.editor.addComponent(component);

    return {
        component,
        close,
    };
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