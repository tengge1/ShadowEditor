import UI from '../ui/UI';
import SetScriptValueCommand from '../command/SetScriptValueCommand';

/**
 * 脚本编辑面板
 * @author mrdoob / http://mrdoob.com/
 */
function Script(app) {
    this.app = app;
    UI.Control.call(this, { parent: this.app.container });
};

Script.prototype = Object.create(UI.Control.prototype);
Script.prototype.constructor = Script;

Script.prototype.render = function () {
    var container;

    var data = {
        xtype: 'div',
        parent: this.app.container,
        id: 'script',
        style: 'background-color: #272822; display: none;',
        children: [{
            xtype: 'div',
            style: 'padding: 10px;',
            children: [{
                id: 'scriptTitle',
                xtype: 'text',
                style: 'color: #fff;'
            }, {
                xtype: 'closebutton',
                style: 'position: absolute; top: 3px; right: 1px; cursor: pointer',
                onClick: function () {
                    if (container) {
                        container.dom.style.display = 'none';
                    }
                }
            }]
        }]
    };

    container = UI.create(data);
    container.render();

    var title = UI.get('scriptTitle');

    // 业务逻辑
    var currentMode;
    var currentScript;
    var currentObject;

    var _this = this;

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
    codemirror.on('change', function () {
        _this.app.call('codeMirrorChange', _this, codemirror, currentMode, currentScript, currentObject);
    });

    // 防止回退键删除物体
    var wrapper = codemirror.getWrapperElement();
    wrapper.addEventListener('keydown', function (event) {
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

    codemirror.on('cursorActivity', function (cm) {
        if (currentMode !== 'javascript') {
            return;
        }
        server.updateArgHints(cm);
    });

    codemirror.on('keypress', function (cm, kb) {
        if (currentMode !== 'javascript') {
            return;
        }
        var typed = String.fromCharCode(kb.which || kb.keyCode);
        if (/[\w\.]/.exec(typed)) {
            server.complete(cm);
        }
    });

    //
    this.app.on('editorCleared.Script', function () {
        container.dom.style.display = 'none';
    });

    this.app.on('editScript.Script', function (object, script) {
        var mode, name, source;

        if (typeof (script) === 'object') {
            mode = 'javascript';
            name = script.name;
            source = script.source;
            title.setValue(object.name + ' / ' + name);
        } else {
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

        currentMode = mode;
        currentScript = script;
        currentObject = object;

        container.dom.style.display = 'block';
        codemirror.setValue(source);
        if (mode === 'json') mode = { name: 'javascript', json: true };
        codemirror.setOption('mode', mode);
    });

    this.app.on('scriptRemoved.Script', function (script) {
        if (currentScript === script) {
            container.dom.style.display = 'none';
        }
    });

    this.app.on('refreshScriptEditor.Script', function (object, script, cursorPosition, scrollInfo) {
        if (currentScript !== script) return;

        // copying the codemirror history because "codemirror.setValue(...)" alters its history

        var history = codemirror.getHistory();
        title.setValue(object.name + ' / ' + script.name);
        codemirror.setValue(script.source);

        if (cursorPosition !== undefined) {

            codemirror.setCursor(cursorPosition);
            codemirror.scrollTo(scrollInfo.left, scrollInfo.top);

        }
        codemirror.setHistory(history); // setting the history to previous state
    });
};

export default Script;