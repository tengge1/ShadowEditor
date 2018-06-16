import Options from './Options';
import Editor from './Editor';
import EventDispatcher from './event/EventDispatcher';
import Viewport from './ui/Viewport';
import Script from './core/Script';
import Player from './core/Player';
import Toolbar from './ui/Toolbar';
import Menubar from './menu/Menubar';
import Panel from './panel/Panel';
import UI from './ui/UI';
import RemoveObjectCommand from './command/RemoveObjectCommand';

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

    var viewport = new Viewport(this.editor);
    this.container.appendChild(viewport.dom);

    var script = new Script(this.editor);
    this.container.appendChild(script.dom);

    var player = new Player(this.editor);
    this.container.appendChild(player.dom);

    var toolbar = new Toolbar(this.editor);
    this.container.appendChild(toolbar.dom);

    var menubar = new Menubar(this.editor);
    this.container.appendChild(menubar.dom);

    var sidebar = new Panel(this.editor);
    this.container.appendChild(sidebar.dom);

    var modal = new UI.Modal();
    this.container.appendChild(modal.dom);

    // 是否从文件中加载场景，从文件中加载场景的url格式是index.html#file=xxx
    this.isLoadingFromHash = false;
}

Application.prototype.start = function () {
    this.event.start();

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