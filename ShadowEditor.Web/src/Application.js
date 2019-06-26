import Options from './Options';
import Storage from './utils/Storage';

import EventDispatcher from './event/EventDispatcher';

import EditorUI from './editor2/EditorUI.jsx';
import Editor from './editor/Editor';

import PackageManager from './package/PackageManager';

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

    // 存储
    this.storage = new Storage();
    this.initStorage();

    // 包管理器
    this.packageManager = new PackageManager();
    this.require = this.packageManager.require.bind(this.packageManager);

    // 事件
    this.event = new EventDispatcher(this);
    this.call = this.event.call.bind(this.event);
    this.on = this.event.on.bind(this.event);

    var params = {
        app: this
    };

    // 用户界面
    // this.menubar = new Menubar(params); // 菜单栏
    // this.toolbar = new Toolbar(params); // 工具栏
    // this.viewport = new Viewport(params); // 场景编辑区
    // this.sidebar = new Sidebar(params); // 侧边栏
    // this.sidebar2 = new Sidebar2(params); // 侧边栏2
    // this.bottomPanel = new BottomPanel(params); // 底部面板
    // this.statusBar = new StatusBar(params); // 状态栏
    // this.script = new ScriptEditor(params); // 脚本编辑器面板
    // this.player = new Player({
    //     server: this.options.server,
    //     enableThrowBall: false,
    //     showStats: true,
    // }); // 播放器面板

    // UI
    this.ui = React.createElement(EditorUI);
    ReactDOM.render(this.ui, this.container);

    // 编辑器
    // this.editor = new Editor(this);
}

Application.prototype.initStorage = function () {
    if (this.storage.get('showGrid') === undefined) {
        this.storage.set('showGrid', true);
    }

    if (this.storage.get('showCamera') === undefined) {
        this.storage.set('showCamera', false);
    }

    if (this.storage.get('showPointLight') === undefined) {
        this.storage.set('showPointLight', true);
    }

    if (this.storage.get('showDirectionalLight') === undefined) {
        this.storage.set('showDirectionalLight', true);
    }

    if (this.storage.get('showSpotLight') === undefined) {
        this.storage.set('showSpotLight', true);
    }

    if (this.storage.get('showHemisphereLight') === undefined) {
        this.storage.set('showHemisphereLight', true);
    }

    if (this.storage.get('showRectAreaLight') === undefined) {
        this.storage.set('showRectAreaLight', true);
    }

    if (this.storage.get('showSkeleton') === undefined) {
        this.storage.set('showSkeleton', false);
    }
};

// ------------------------- 程序控制 -------------------------------

Application.prototype.start = function () {
    // 启动事件 - 事件要在ui创建完成后启动
    // this.event.start();

    this.call('appStart', this);
    this.call('appStarted', this);

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

export default Application;