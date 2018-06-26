import Options from './Options';
import Editor from './editor/Editor';
import EventDispatcher from './event/EventDispatcher';
import Viewport from './editor/Viewport';
import Script from './core/Script';
import Player from './core/Player';
import StatusBar from './editor/StatusBar';
import Menubar from './editor/Menubar';
import Sidebar from './panel/Sidebar';

/**
 * 应用程序
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

    // 编辑器ui
    this.editor = new Editor(this); // 编辑器
    this.menubar = new Menubar(this); // 菜单栏
    this.viewport = new Viewport(this); // 编辑区
    this.sidebar = new Sidebar(this); // 侧边栏
    this.container.appendChild(this.sidebar.dom);
    this.statusBar = new StatusBar(this); // 状态栏
    this.script = new Script(this); // 脚本编辑窗口
    this.player = new Player(this); // 启动窗口
    this.container.appendChild(this.player.dom);

    // 是否从文件中加载场景，从文件中加载场景的url格式是index.html#file=xxx
    this.isLoadingFromHash = false;
}

Application.prototype.start = function () {
    // 启动事件 - 事件要在ui创建完成后启动
    this.event.start();

    this.call('appStart', this);
    this.call('resize', this);
    this.call('initApp', this);
    this.call('appStarted', this);
};

Application.prototype.stop = function () {
    this.call('appStop', this);
    this.call('appStoped', this);

    this.event.stop();
};

export default Application;