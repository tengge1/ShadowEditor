import Options from './Options';

import UI from './ui/UI';
import EventDispatcher from './event/EventDispatcher';

import Menubar from './editor/menubar/Menubar';
import Toolbar from './editor/Toolbar';
import Viewport from './editor/Viewport';
import Sidebar from './editor/sidebar/Sidebar';
import StatusBar from './editor/StatusBar';
import ScriptEditor from './editor/script/ScriptEditor';
import Player from './editor/Player';
import TimePanel from './editor/TimePanel';

import Editor from './editor/Editor';
import Physics from './editor/Physics';

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

    var params = { app: this, parent: this.container };

    // 用户界面
    this.ui = UI;

    this.menubar = new Menubar(params); // 菜单栏
    this.menubar.render();

    this.toolbar = new Toolbar(params); // 工具栏
    this.toolbar.render();

    this.viewport = new Viewport(params); // 场景编辑区
    this.viewport.render();

    this.editor = new Editor(this); // 编辑器

    this.sidebar = new Sidebar(params); // 侧边栏
    this.sidebar.render();

    this.statusBar = new StatusBar(params); // 状态栏
    this.statusBar.render();

    this.script = new ScriptEditor(params); // 脚本编辑器
    this.script.render();

    this.player = new Player(params); // 播放器面板
    this.player.render();

    this.timePanel = new TimePanel(params); // 时间面板
    this.timePanel.render();

    // 物理引擎
    this.physics = new Physics(params);
}

// ------------------------- 程序控制 -------------------------------

Application.prototype.start = function () {
    // 启动事件 - 事件要在ui创建完成后启动
    this.event.start();

    this.call('appStart', this);
    this.call('resize', this);
    this.call('appStarted', this);

    // 启动物体引擎
    this.physics.start();

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