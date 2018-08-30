import UI from '../../ui/UI';
import SetScriptValueCommand from '../../command/SetScriptValueCommand';

/**
 * 脚本编辑器
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function ScriptEditor(options) {
    UI.Control.call(this, options);
    this.app = options.app;

    this.codemirror = null;
    this.server = null;

    this.name = null;
    this.mode = null;
    this.source = null;
    this.title = null;
};

ScriptEditor.prototype = Object.create(UI.Control.prototype);
ScriptEditor.prototype.constructor = ScriptEditor;

ScriptEditor.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.app.container,
        id: 'scriptEditor',
        cls: 'script',
        style: {
            backgroundColor: '#272822',
            display: 'none'
        },
        children: [{
            xtype: 'div',
            style: {
                padding: '10px'
            },
            children: [{
                xtype: 'text',
                id: 'scriptTitle',
                style: {
                    color: '#fff'
                }
            }, {
                xtype: 'closebutton',
                style: {
                    position: 'absolute',
                    top: '3px',
                    right: '1px',
                    cursor: 'pointer'
                },
                onClick: this.hide.bind(this)
            }]
        }]
    };

    var container = UI.create(data);
    container.render();

    // 绑定事件
    this.app.on(`appStarted.${this.id}`, this.onAppStarted.bind(this));
};

/**
 * 打开脚本文件
 * @param {*} name 名称
 * @param {*} mode 类型 javascript、glsl、json 默认：javascript
 * @param {*} source 源码 文件初始代码 默认：空
 * @param {*} title 标题 文件标题 默认：未命名.${文件类型}
 */
ScriptEditor.prototype.open = function (name, mode, source, title) {
    var scriptTitle = UI.get('scriptTitle');

    name = name || '未命名';
    mode = mode || 'javascript';
    source = source || '';
    title = title || '未命名';
    title = `${title}.${mode === 'glsl' ? '.glsl' : (mode === 'json' ? '.json' : '.js')}`;

    this.name = name;
    this.mode = mode;
    this.source = source;
    this.title = title;

    this.show();

    scriptTitle.setValue(title);

    this.codemirror.setValue(source);

    // 设置codemirror模式
    if (mode === 'json') {
        this.codemirror.setOption('mode', {
            name: 'javascript',
            json: true
        });
    } else {
        this.codemirror.setOption('mode', mode);
    }
    this.codemirror.focus();
    this.codemirror.setCursor({
        line: 0,
        ch: 0
    });
};

/**
 * 显示脚本编辑器
 */
ScriptEditor.prototype.show = function () {
    var container = UI.get('scriptEditor');
    container.dom.style.display = 'block';
};

/**
 * 隐藏脚本编辑器
 */
ScriptEditor.prototype.hide = function () {
    var container = UI.get('scriptEditor');
    container.dom.style.display = 'none';
};

/**
 * 刷新脚本编辑器
 * @param {*} title 标题
 * @param {*} source 代码
 * @param {*} cursorPosition 光标位置
 * @param {*} scrollInfo 滚动信息
 */
ScriptEditor.prototype.refresh = function (title, source, cursorPosition, scrollInfo) {
    var container = UI.get('scriptEditor');
    var title = UI.get('scriptTitle');

    // 复制codemirror的历史记录，因为"codemirror.setValue(...)"函数会改变它的历史。
    var history = this.codemirror.getHistory();
    title.setValue(title);
    this.codemirror.setValue(source);

    if (cursorPosition !== undefined) {
        this.codemirror.setCursor(cursorPosition);
        this.codemirror.scrollTo(scrollInfo.left, scrollInfo.top);
    }

    this.codemirror.setHistory(history); // 设置历史到先前状态
};

// 内部方法

ScriptEditor.prototype.onAppStarted = function () {
    var container = UI.get('scriptEditor');

    var codemirror = CodeMirror(container.dom, {
        value: '',
        lineNumbers: true,
        matchBrackets: true,
        indentWithTabs: true,
        tabSize: 4,
        indentUnit: 4,
        hintOptions: {
            completeSingle: false
        }
    });

    codemirror.setOption('theme', 'monokai');
    codemirror.on('change', () => {
        debugger
        // this.app.call('codeMirrorChange', this, codemirror, this.currentMode, this.currentScript, this.currentObject);
    });

    // 防止回退键删除物体
    var wrapper = codemirror.getWrapperElement();
    wrapper.addEventListener('keydown', event => {
        event.stopPropagation();
    });

    // tern js 自动完成
    var server = new CodeMirror.TernServer({
        caseInsensitive: true,
        plugins: { threejs: null }
    });

    // 快捷键
    codemirror.setOption('extraKeys', {
        'Ctrl-Space': cm => { server.complete(cm); },
        'Ctrl-I': cm => { server.showType(cm); },
        'Ctrl-O': cm => { server.showDocs(cm); },
        'Alt-.': cm => { server.jumpToDef(cm); },
        'Alt-,': cm => { server.jumpBack(cm); },
        'Ctrl-Q': cm => { server.rename(cm); },
        'Ctrl-.': cm => { server.selectName(cm); }
    });

    codemirror.on('cursorActivity', cm => {
        if (this.mode !== 'javascript') {
            return;
        }
        server.updateArgHints(cm);
    });

    codemirror.on('keypress', (cm, kb) => {
        if (this.mode !== 'javascript') {
            return;
        }
        var typed = String.fromCharCode(kb.which || kb.keyCode);
        if (/[\w\.]/.exec(typed)) {
            server.complete(cm);
        }
    });

    this.codemirror = codemirror;
    this.server = server;
};

export default ScriptEditor;