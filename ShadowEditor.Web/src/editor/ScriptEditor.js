import UI from '../ui/UI';
import SetScriptValueCommand from '../command/SetScriptValueCommand';

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

    this.currentMode = null;
    this.currentScript = null;
    this.currentObject = null;
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
                onClick: this.onClose.bind(this)
            }]
        }]
    };

    var container = UI.create(data);
    container.render();

    // 绑定事件
    this.app.on(`appStarted.${this.id}`, this.onAppStarted.bind(this));
    this.app.on(`editorCleared.${this.id}`, this.onEditorCleared.bind(this));
    this.app.on(`editScript.${this.id}`, this.onEditScript.bind(this));
    this.app.on(`scriptRemoved.${this.id}`, this.onScriptRemoved.bind(this));
    this.app.on(`refreshScriptEditor.${this.id}`, this.onRefreshScriptEditor.bind(this));
};

ScriptEditor.prototype.onClose = function () {
    var container = UI.get('scriptEditor');
    container.dom.style.display = 'none';
};

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
        this.app.call('codeMirrorChange', this, codemirror, this.currentMode, this.currentScript, this.currentObject);
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

    codemirror.setOption('extraKeys', {
        'Ctrl-Space': function (cm) { server.complete(cm); },
        'Ctrl-I': function (cm) { server.showType(cm); },
        'Ctrl-O': function (cm) { server.showDocs(cm); },
        'Alt-.': function (cm) { server.jumpToDef(cm); },
        'Alt-,': function (cm) { server.jumpBack(cm); },
        'Ctrl-Q': function (cm) { server.rename(cm); },
        'Ctrl-.': function (cm) { server.selectName(cm); }
    });

    codemirror.on('cursorActivity', cm => {
        if (this.currentMode !== 'javascript') {
            return;
        }
        server.updateArgHints(cm);
    });

    codemirror.on('keypress', (cm, kb) => {
        if (this.currentMode !== 'javascript') {
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

ScriptEditor.prototype.onEditorCleared = function () {
    var container = UI.get('scriptEditor');
    container.dom.style.display = 'none';
};

ScriptEditor.prototype.onEditScript = function (object, script) {
    var container = UI.get('scriptEditor');
    var title = UI.get('scriptTitle');

    var mode, name, source;

    if (typeof (script) === 'object') { // 编辑javascript脚本
        mode = 'javascript';
        name = script.name;
        source = script.source;
        title.setValue(object.name + ' / ' + name);
    } else { // 编辑着色器程序和材质信息
        switch (script) {
            case 'vertexShader':
                mode = 'glsl';
                name = 'Vertex Shader';
                source = object.material.vertexShader || "";
                break;
            case 'fragmentShader':
                mode = 'glsl';
                name = 'Fragment Shader';
                source = object.material.fragmentShader || "";
                break;
            case 'programInfo':
                mode = 'json';
                name = 'Program Properties';
                var json = {
                    defines: object.material.defines,
                    uniforms: object.material.uniforms,
                    attributes: object.material.attributes
                };
                source = JSON.stringify(json, null, '\t');
        }
        title.setValue(object.material.name + ' / ' + name);
    }

    this.currentMode = mode;
    this.currentScript = script;
    this.currentObject = object;

    container.dom.style.display = 'block';
    this.codemirror.setValue(source);

    if (mode === 'json') {
        mode = {
            name: 'javascript',
            json: true
        };
    }

    this.codemirror.setOption('mode', mode);
};

ScriptEditor.prototype.onScriptRemoved = function (script) {
    var container = UI.get('scriptEditor');

    if (this.currentScript === script) {
        container.dom.style.display = 'none';
    }
};

ScriptEditor.prototype.onRefreshScriptEditor = function (object, script, cursorPosition, scrollInfo) {
    if (this.currentScript !== script) {
        return;
    }

    var container = UI.get('scriptEditor');
    var title = UI.get('scriptTitle');

    // 复制codemirror的历史记录，因为"codemirror.setValue(...)"函数会改变它的历史。
    var history = this.codemirror.getHistory();
    title.setValue(object.name + ' / ' + script.name);
    this.codemirror.setValue(script.source);

    if (cursorPosition !== undefined) {
        this.codemirror.setCursor(cursorPosition);
        this.codemirror.scrollTo(scrollInfo.left, scrollInfo.top);
    }

    this.codemirror.setHistory(history); // 设置历史到先前状态
};

export default ScriptEditor;