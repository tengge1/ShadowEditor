import Options from './Options';
import Editor from './editor/Editor';
import EventDispatcher from './event/EventDispatcher';
import Viewport from './editor/Viewport';
import Script from './editor/Script';
import Player from './core/Player';
import StatusBar from './editor/StatusBar';
import Menubar from './editor/Menubar';
import Sidebar from './editor/sidebar/Sidebar';

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

    // 用户界面
    this.menubar = new Menubar(this); // 菜单栏
    this.menubar.render();

    this.viewport = new Viewport(this); // 场景编辑区
    this.viewport.render();

    this.editor = new Editor(this); // 编辑器

    this.sidebar = new Sidebar(this); // 侧边栏

    this.statusBar = new StatusBar(this); // 状态栏
    this.statusBar.render();

    this.script = new Script(this); // 脚本编辑窗口
    this.script.render();

    this.player = new Player(this); // 启动窗口

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
    this.call('animate', this);
};

Application.prototype.stop = function () {
    this.call('appStop', this);
    this.call('appStoped', this);

    this.event.stop();
};

export default Application;