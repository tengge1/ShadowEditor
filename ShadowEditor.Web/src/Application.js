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
import Ajax from './utils/Ajax';

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

// ----------------------- UI操作 ---------------------------------

/**
 * 创建元素
 * @param {React.Component} type ReactComponent类型
 * @param {Object} props ReactComponent属性
 * @param {Object} children 子节点
 */
Application.prototype.createElement = function (type, props, children) {
    return this.editor.createElement(type, props, children);
};

/**
 * 添加元素
 * @param {Object} element ReactElement元素
 * @param {Function} callback 回调函数
 */
Application.prototype.addElement = function (element, callback) {
    return this.editor.addElement(element, callback);
};

/**
 * 移除元素
 * @param {Object} element ReactElement元素
 * @param {Function} callback 回调函数
 */
Application.prototype.removeElement = function (element, callback) {
    return this.editor.removeElement(element, callback);
};

/**
 * 弹窗一段时间消失的消息窗口
 * @param {String} content 内容
 */
Application.prototype.toast = function (content) {
    let component = this.createElement(Toast, undefined, content);

    this.addElement(component);

    setTimeout(() => {
        this.removeElement(component);
    }, 5000);
};

/**
 * 提示窗口
 * @param {Object} options 选项
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
        component && this.removeElement(component);
    };

    if (onOK === undefined && onClose === undefined) {
        onOK = onClose = close;
    } else if (onClose === undefined) {
        onClose = onOK;
    }

    component = this.createElement(Alert, {
        title,
        okText: L_OK,
        className,
        style,
        onOK,
        onClose,
    }, content);

    this.addElement(component);

    return {
        component,
        close,
    };
};

/**
 * 询问窗口
 * @param {Object} options 选项
 * @param {String} options.title 标题
 * @param {String} options.content 内容
 * @param {String} options.className 样式类
 * @param {Object} options.style 样式
 * @param {Function} options.onOK 点击确定回调函数
 * @param {Function} options.onCancel 点击取消回调函数
 */
Application.prototype.confirm = function (options = {}) {
    let { title, content, className, style, onOK, onCancel } = options;

    let component;

    let close = () => {
        component && this.removeElement(component);
    };

    let handleOK = () => {
        if (onOK && onOK() !== false) {
            close();
        }
    };

    if (onCancel === undefined) {
        onCancel = close;
    }

    component = this.createElement(Confirm, {
        title,
        okText: L_OK,
        cancelText: L_CANCEL,
        className,
        style,
        onOK: handleOK,
        onCancel,
        onClose: onCancel,
    }, content);

    this.addElement(component);

    return {
        component,
        close,
    };
};

/**
 * 输入窗口
 * @param {Object} options 选项
 * @param {String} options.title 标题
 * @param {String} options.content 内容
 * @param {String} options.className 样式类
 * @param {Object} options.style 样式
 * @param {String} options.value 默认值
 * @param {Function} options.onOK 点击确定执行函数
 * @param {Function} options.onClose 点击关闭执行函数
 */
Application.prototype.prompt = function (options = {}) {
    let { title, content, className, style, value, onOK, onClose } = options;
    let component;

    let close = () => {
        component && this.removeElement(component);
    };

    let handleOK = value => {
        if (onOK && onOK(value) !== false) {
            close();
        }
    };

    if (onClose === undefined) {
        onClose = close;
    }

    component = this.createElement(Prompt, {
        title,
        content,
        className,
        style,
        value,
        okText: L_OK,
        onOK: handleOK,
        onClose,
    });

    this.addElement(component);

    return {
        component,
        close,
    };
};

Application.prototype.upload = function () {
    var input;

    return function (url, callback) {
        if (!input) {
            input = document.createElement('input');
            input.type = 'file';
            input.style.display = 'none';
            input.addEventListener('change', event => {
                Ajax.post(url, {
                    file: event.target.files[0],
                }, json => {
                    var obj = JSON.parse(json);
                    if (obj.Code === 200) {
                        callback(obj);
                    } else {
                        app.toast(obj.Msg);
                    }
                });
            });
            document.body.appendChild(input);
        }
        input.click();
    };
}();

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