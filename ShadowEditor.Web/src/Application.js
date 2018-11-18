import Options from './Options';

import UI from './ui/UI';
import EventDispatcher from './event/EventDispatcher';

import Menubar from './editor/menubar/Menubar';
import Toolbar from './editor/Toolbar';
import Viewport from './editor/Viewport';
import Sidebar from './editor/sidebar/Sidebar';
import Sidebar2 from './editor/sidebar2/Sidebar';
import BottomPanel from './editor/bottom/BottomPanel';
import StatusBar from './editor/StatusBar';
import ScriptEditor from './editor/script/ScriptEditor';
import Player from './player/Player';

import Editor from './editor/Editor';
import Physics from './editor/Physics';

import PackageManager from './core/PackageManager';
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

    var params = { app: this };

    // 用户界面
    this.ui = UI;
    this.menubar = new Menubar(params); // 菜单栏
    this.toolbar = new Toolbar(params); // 工具栏
    this.viewport = new Viewport(params); // 场景编辑区
    this.sidebar = new Sidebar(params); // 侧边栏
    this.sidebar2 = new Sidebar2(params); // 侧边栏2
    this.bottomPanel = new BottomPanel(params); // 底部面板
    this.statusBar = new StatusBar(params); // 状态栏
    this.script = new ScriptEditor(params); // 脚本编辑器
    this.player = new Player(params); // 播放器面板

    UI.create({
        xtype: 'container',
        parent: this.container,
        children: [
            new Menubar(params), {
                xtype: 'div',
                style: {
                    width: '100%',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                },
                children: [
                    this.toolbar, {
                        xtype: 'div',
                        style: {
                            position: 'relative',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                        },
                        children: [{
                            xtype: 'div',
                            style: {
                                position: 'relative',
                                flex: 1
                            },
                            children: [
                                this.viewport,
                                this.script,
                                this.player
                            ]
                        },
                        this.bottomPanel,
                        this.statusBar
                        ]
                    },
                    this.sidebar2,
                    this.sidebar
                ]
            }
        ]
    }).render();

    // 核心
    this.packageManager = new PackageManager('assets');
    this.packageManager.addFromFile('assets/packages.json');

    this.editor = new Editor(this);
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