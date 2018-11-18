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
    this.delay = null; // 代码校验延迟函数
    this.delayTime = 1000; // 代码校验间隔时间（毫秒）

    this.uuid = null;
    this.name = null;
    this.mode = null;
    this.source = null;
    this.title = null;

    this.errorLines = []; // 代码错误行数
    this.widgets = [];

    this.callback = null;
};

ScriptEditor.prototype = Object.create(UI.Control.prototype);
ScriptEditor.prototype.constructor = ScriptEditor;

ScriptEditor.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
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
 * @param {*} uuid 脚本uuid
 * @param {*} name 名称
 * @param {*} mode 类型 javascript、vertexShader、fragmentShader、json 默认：javascript
 * @param {*} source 源码 文件初始代码 默认：空
 * @param {*} title 标题 文件标题 默认：未命名.${文件类型}
 * @param {*} callback 回调函数
 */
ScriptEditor.prototype.open = function (uuid, name, mode, source, title, callback) {
    var scriptTitle = UI.get('scriptTitle');

    // 连续打开脚本时，自动保存上次打开的文件
    if (this.uuid != null) {
        this.save();
        this.uuid = null;
        this.name = null;
        this.mode = null;
        this.source = null;
        this.title = null;
    }

    // 打开新文件
    name = name || '未命名';
    mode = mode || 'javascript';
    source = source || '';
    title = title || '未命名';
    title = `${title}.${(mode === 'vertexShader' || mode === 'fragmentShader') ? '.glsl' : (mode === 'json' ? '.json' : '.js')}`;

    this.uuid = uuid;
    this.name = name;
    this.mode = mode;
    this.source = source;
    this.title = title;
    this.callback = callback;

    this.show();

    scriptTitle.setValue(title);

    this.codemirror.setValue(source);

    // 设置codemirror模式
    if (mode === 'json') {
        this.codemirror.setOption('mode', {
            name: 'javascript',
            json: true
        });
    } if (mode === 'vertexShader' || mode === 'fragmentShader') {
        this.codemirror.setOption('mode', 'glsl');
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

    this.save();
    container.dom.style.display = 'none';

    this.uuid = null;
    this.name = null;
    this.mode = null;
    this.source = null;
    this.title = null;
};

/**
 * 保存脚本
 */
ScriptEditor.prototype.save = function () {
    var value = this.codemirror.getValue();

    if (typeof (this.callback) === 'function') {
        this.callback.call(this, value);
    }

    this.app.log(`${this.uuid}脚本保存成功！`);
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
    codemirror.on('change', this.onCodeMirrorChange.bind(this));

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

/**
 * 代码修改事件
 */
ScriptEditor.prototype.onCodeMirrorChange = function () {
    if (this.codemirror.state.focused === false) {
        return;
    }

    if (this.delay) {
        clearTimeout(this.delay);
    }

    this.delay = setTimeout(() => {
        var code = this.codemirror.getValue();
        this.validate(code);
    }, this.delayTime);
};

/**
 * 校验编辑器中代码正确性
 * @param {*} string 
 */
ScriptEditor.prototype.validate = function (string) {
    var codemirror = this.codemirror;
    var mode = this.mode;

    var errorLines = this.errorLines;
    var widgets = this.widgets;

    var errors = [];

    return codemirror.operation(() => {
        while (errorLines.length > 0) {
            codemirror.removeLineClass(errorLines.shift(), 'background', 'errorLine');
        }

        while (widgets.length > 0) {
            codemirror.removeLineWidget(widgets.shift());
        }

        switch (mode) {
            case 'javascript':
                try {
                    var syntax = esprima.parse(string, { tolerant: true });
                    errors = syntax.errors;
                } catch (error) {
                    errors.push({
                        lineNumber: error.lineNumber - 1,
                        message: error.message
                    });
                }

                for (var i = 0; i < errors.length; i++) {
                    var error = errors[i];
                    error.message = error.message.replace(/Line [0-9]+: /, '');
                }
                break;
            case 'json':
                jsonlint.parseError = (message, info) => {
                    message = message.split('\n')[3];
                    errors.push({
                        lineNumber: info.loc.first_line - 1,
                        message: message
                    });
                };

                try {
                    jsonlint.parse(string);
                } catch (error) {
                    // ignore failed error recovery
                }
                break;
            case 'vertexShader':
            case 'fragmentShader':
                try {
                    var shaderType = mode === 'vertexShader' ? glslprep.Shader.VERTEX : glslprep.Shader.FRAGMENT;
                    glslprep.parseGlsl(string, shaderType);
                } catch (error) {
                    if (error instanceof glslprep.SyntaxError) {
                        errors.push({
                            lineNumber: error.line,
                            message: "Syntax Error: " + error.message
                        });
                    } else {
                        console.error(error.stack || error);
                    }
                }
        }

        for (var i = 0; i < errors.length; i++) {
            var error = errors[i];

            var message = document.createElement('div');
            message.className = 'esprima-error';
            message.textContent = error.message;

            var lineNumber = Math.max(error.lineNumber, 0);
            errorLines.push(lineNumber);

            codemirror.addLineClass(lineNumber, 'background', 'errorLine');

            var widget = codemirror.addLineWidget(lineNumber, message);
            widgets.push(widget);
        }

        return errors.length === 0;
    });
};

export default ScriptEditor;