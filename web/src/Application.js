/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import {
    Message,
    Alert,
    Confirm,
    Prompt,
    Photo,
    Video
} from './ui/index';
import Options from './Options';
import Storage from './utils/Storage';
import Server from './utils/Server';
import PackageManager from './package/PackageManager';
import EventDispatcher from './event/EventDispatcher';
import Editor from './editor/Editor.jsx';
import Ajax from './utils/Ajax';
import LanguageLoader from './utils/LanguageLoader';

/**
 * 应用程序
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 * @param {HTMLElement} container 容器
 * @param {Object} options 配置
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
    this.debug = this.storage.get('debug') || false;

    // 服务端配置
    this.server = new Server(this.options.server);

    // 包管理器
    this.packageManager = new PackageManager();
    this.require = this.packageManager.require.bind(this.packageManager);

    // 事件
    this.event = new EventDispatcher(this);
    this.call = this.event.call.bind(this.event);
    this.on = this.event.on.bind(this.event);

    // 异步获取数据
    const promise1 = new Promise(resolve => { // 加载语言包
        const loader = new LanguageLoader();
        loader.load().then(() => {
            resolve();
        });
    });

    const promise2 = new Promise(resolve => { // 加载物理引擎
        // TODO: 由于ammo.js升级，导致很多类库不兼容，所以只能这么写。
        Ammo().then(AmmoLib => {
            window.Ammo = AmmoLib;
            resolve();
        });
    });

    const promise3 = new Promise(resolve => { // 加载服务器配置
        this.server.load().then(() => {
            resolve();
        });
    });

    Promise.all([promise1, promise2, promise3]).then(() => {
        this.ui = React.createElement(Editor);
        this.event.start();
        ReactDOM.render(this.ui, this.container);
    });
}

// ----------------------- UI函数 ---------------------------------

/**
 * 创建元素
 * @param {React.Component} type ReactComponent类型
 * @param {Object} props ReactComponent属性
 * @param {Object} children 子节点
 * @returns {*} React元素
 */
Application.prototype.createElement = function (type, props, children) {
    return this.editor.createElement(type, props, children);
};

/**
 * 添加元素
 * @param {Object} element ReactElement元素
 * @param {Function} callback 回调函数
 * @returns {*} React元素
 */
Application.prototype.addElement = function (element, callback) {
    return this.editor.addElement(element, callback);
};

/**
 * 移除元素
 * @param {Object} element ReactElement元素
 * @param {Function} callback 回调函数
 * @returns {*} React元素
 */
Application.prototype.removeElement = function (element, callback) {
    return this.editor.removeElement(element, callback);
};

/**
 * 弹窗一段时间消失的消息窗口
 * @param {String} content 内容
 * @param {String} type 类型（info, success, warn, error）
 */
Application.prototype.toast = function (content, type = 'info') {
    let component = this.createElement(Message, {
        type
    }, content);

    this.addElement(component);

    setTimeout(() => {
        this.removeElement(component);
    }, 3000);
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
 * @returns {*} React元素
 */
Application.prototype.alert = function (options = {}) {
    let {
        title,
        content,
        className,
        style,
        onOK,
        onClose
    } = options;
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
        okText: _t('OK'),
        className,
        style,
        onOK,
        onClose
    }, content);

    this.addElement(component);

    return {
        component,
        close
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
 * @returns {*} React元素
 */
Application.prototype.confirm = function (options = {}) {
    const {
        title,
        content,
        okText,
        cancelText,
        className,
        style,
        onOK,
        onCancel
    } = options;

    let component;

    let close = () => {
        component && this.removeElement(component);
    };

    let handleOK = () => {
        if (onOK && onOK() !== false) {
            close();
        }
    };

    let handleCancel = () => {
        if (onCancel && onCancel() !== false || !onCancel) {
            close();
        }
    };

    component = this.createElement(Confirm, {
        title,
        okText: okText || _t('OK'),
        cancelText: cancelText || _t('Cancel'),
        className,
        style,
        onOK: handleOK,
        onCancel: handleCancel,
        onClose: handleCancel
    }, content);

    this.addElement(component);

    return {
        component,
        close
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
 * @param {Boolean} options.mask 是否显示遮罩层
 * @param {Function} options.onOK 点击确定执行函数
 * @param {Function} options.onClose 点击关闭执行函数
 * @returns {*} React元素
 */
Application.prototype.prompt = function (options = {}) {
    let {
        title,
        content,
        className,
        style,
        value,
        mask,
        onOK,
        onClose
    } = options;
    let component;

    let close = () => {
        component && this.removeElement(component);
    };

    let handleOK = value => {
        if (onOK && onOK(value) !== false) {
            close();
        }
    };

    let handleClose = () => {
        if (onClose === undefined) {
            close();
        } else if (onClose && onClose() !== false) {
            close();
        }
    };

    component = this.createElement(Prompt, {
        title,
        content,
        className,
        style,
        value,
        okText: _t('OK'),
        mask,
        onOK: handleOK,
        onClose: handleClose
    });

    this.addElement(component);

    return {
        component,
        close
    };
};

/**
 * 显示加载器
 * @param {*} text 加载器文本
 */
Application.prototype.mask = function (text) {
    this.call('showMask', this, true, text);
};

/**
 * 隐藏加载器
 */
Application.prototype.unmask = function () {
    this.call('showMask', this, false);
};

/**
 * 查看图片
 * @param {String} url 地址
 */
Application.prototype.photo = function (url) {
    let component = null;

    let close = () => {
        if (component) {
            this.removeElement(component);
            component = null;
        }
    };

    component = this.createElement(Photo, {
        url,
        onClick: close
    });

    this.addElement(component);
};

/**
 * 查看视频
 * @param {String} url 地址
 */
Application.prototype.video = function (url) {
    let component = null;

    let close = () => {
        if (component) {
            this.removeElement(component);
            component = null;
        }
    };

    component = this.createElement(Video, {
        url,
        onClick: close
    });

    this.addElement(component);
};

// -------------------- 工具函数  -----------------------

/**
 * 上传文件
 * @param {Object} url 上传Url
 * @param {String} callback 回调函数
 */
Application.prototype.upload = function () {
    let input;

    return function (url, callback) {
        if (!input) {
            input = document.createElement('input');
            input.type = 'file';
            input.style.display = 'none';
            input.addEventListener('change', event => {
                Ajax.post(url, {
                    file: event.target.files[0]
                }, json => {
                    let obj = JSON.parse(json);
                    if (obj.Code === 200) {
                        callback(obj);
                    } else {
                        app.toast(_t(obj.Msg), 'warn');
                    }
                });
            });
            document.body.appendChild(input);
        }
        input.value = null;
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