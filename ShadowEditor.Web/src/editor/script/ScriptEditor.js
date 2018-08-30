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

ScriptEditor.prototype.onCodeMirrorChange = function (codemirror, currentMode, currentScript, currentObject) {
    if (codemirror.state.focused === false) {
        return;
    }

    clearTimeout(this.delay);

    var _this = this;

    this.delay = setTimeout(function () {
        var value = codemirror.getValue();

        if (!_this.validate(codemirror, currentMode, currentObject, value)) {
            return;
        }

        if (typeof (currentScript) === 'object') {
            if (value !== currentScript.source) {
                _this.app.editor.execute(new SetScriptValueCommand(currentObject, currentScript, 'source', value, codemirror.getCursor(), codemirror.getScrollInfo()));
            }
            return;
        }

        if (currentScript !== 'programInfo') {
            return;
        }

        var json = JSON.parse(value);

        if (JSON.stringify(currentObject.material.defines) !== JSON.stringify(json.defines)) {
            var cmd = new SetMaterialValueCommand(currentObject, 'defines', json.defines);
            cmd.updatable = false;
            editor.execute(cmd);
        }
        if (JSON.stringify(currentObject.material.uniforms) !== JSON.stringify(json.uniforms)) {
            var cmd = new SetMaterialValueCommand(currentObject, 'uniforms', json.uniforms);
            cmd.updatable = false;
            editor.execute(cmd);
        }
        if (JSON.stringify(currentObject.material.attributes) !== JSON.stringify(json.attributes)) {
            var cmd = new SetMaterialValueCommand(currentObject, 'attributes', json.attributes);
            cmd.updatable = false;
            editor.execute(cmd);
        }
    }, 1000);
};

ScriptEditor.prototype.validate = function (codemirror, currentMode, currentObject, string) {
    var errorLines = this.errorLines;
    var widgets = this.widgets;

    var valid;
    var errors = [];

    var _this = this;

    return codemirror.operation(function () {

        while (errorLines.length > 0) {
            codemirror.removeLineClass(errorLines.shift(), 'background', 'errorLine');
        }

        while (widgets.length > 0) {
            codemirror.removeLineWidget(widgets.shift());
        }

        //
        switch (currentMode) {
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
                errors = [];

                jsonlint.parseError = function (message, info) {
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
            case 'glsl':
                try {
                    var shaderType = currentScript === 'vertexShader' ?
                        glslprep.Shader.VERTEX : glslprep.Shader.FRAGMENT;
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

                if (errors.length !== 0) {
                    break;
                }
                if (_this.app.editor.renderer instanceof THREE.WebGLRenderer === false) {
                    break;
                }

                currentObject.material[currentScript] = string;
                currentObject.material.needsUpdate = true;

                _this.app.call('materialChanged', _this, currentObject.material);

                var programs = _this.app.editor.renderer.info.programs;

                valid = true;
                var parseMessage = /^(?:ERROR|WARNING): \d+:(\d+): (.*)/g;

                for (var i = 0, n = programs.length; i !== n; ++i) {
                    var diagnostics = programs[i].diagnostics;

                    if (diagnostics === undefined || diagnostics.material !== currentObject.material) {
                        continue;
                    }

                    if (!diagnostics.runnable) {
                        valid = false;
                    }

                    var shaderInfo = diagnostics[currentScript];
                    var lineOffset = shaderInfo.prefix.split(/\r\n|\r|\n/).length;

                    while (true) {
                        var parseResult = parseMessage.exec(shaderInfo.log);
                        if (parseResult === null) break;

                        errors.push({
                            lineNumber: parseResult[1] - lineOffset,
                            message: parseResult[2]
                        });
                    } // messages
                    break;
                } // programs

        } // mode switch

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

        return valid !== undefined ? valid : errors.length === 0;
    });
};

export default ScriptEditor;