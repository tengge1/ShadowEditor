import Options from './Options';
import Editor from './editor/Editor';
import EventDispatcher from './event/EventDispatcher';
import Viewport from './editor/Viewport';
import Script from './core/Script';
import Player from './core/Player';
import Toolbar from './editor/Toolbar';
import Menubar from './menu/Menubar';
import Panel from './panel/Panel';
import UI from './ui/UI';

/**
 * 应用程序
 */
function Application(container, options) {

    this.container = container;
    this.options = new Options(options);

    // 事件
    this.event = new EventDispatcher(this);
    this.call = this.event.call.bind(this.event);
    this.on = this.event.on.bind(this.event);

    // 编辑器
    this.editor = new Editor(this);

    // 编辑区
    this.viewport = new Viewport(this);
    this.container.appendChild(this.viewport.dom);

    // 脚本编辑窗口
    this.script = new Script(this);
    this.container.appendChild(this.script.dom);

    // 启动窗口
    this.player = new Player(this);
    this.container.appendChild(this.player.dom);

    // 底部状态栏
    this.toolbar = new Toolbar(this);
    this.container.appendChild(this.toolbar.dom);

    // 菜单栏
    this.menubar = new Menubar(this);
    this.container.appendChild(this.menubar.dom);

    // 侧边栏
    this.sidebar = new Panel(this);
    this.container.appendChild(this.sidebar.dom);

    // 是否从文件中加载场景，从文件中加载场景的url格式是index.html#file=xxx
    this.isLoadingFromHash = false;
}

Application.prototype.start = function () {
    this.event.start();

    this.call('resize');

    // 应用程序初始化
    var editor = this.editor;
    var _this = this;

    editor.setTheme(editor.config.getKey('theme'));

    editor.storage.init(function () {

        editor.storage.get(function (state) {

            // 从文件中读取场景时，如果读取缓存，会覆盖从文件中读取的场景，所以直接返回
            if (_this.isLoadingFromHash) {
                return;
            };

            if (state !== undefined) {
                editor.fromJSON(state);
            }

            var selected = editor.config.getKey('selected');

            if (selected !== undefined) {
                editor.selectByUuid(selected);
            }

        });
    });

};

export default Application;