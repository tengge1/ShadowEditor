/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 脚本编辑器
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 * @param {*} container 容器
 */
function ScriptEditor(container = document.body) {
    this.delay = null; // 代码校验延迟函数
    this.delayTime = 1000; // 代码校验间隔时间（毫秒）

    this.mode = 'javascript'; // 模式：json, vertexShader, fragmentShader, javascript
    this.source = ''; // 代码

    this.errorLines = []; // 代码错误行数
    this.widgets = [];

    // Code Mirror
    var codemirror = CodeMirror(container, {
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

        try {
            server.updateArgHints(cm);
        } catch(e) {
            console.log(e);
        }
    });

    codemirror.on('keypress', (cm, kb) => {
        if (this.mode !== 'javascript') {
            return;
        }
        var typed = String.fromCharCode(kb.which || kb.keyCode);
        if (/[\w\.]/.exec(typed)) { // eslint-disable-line
            server.complete(cm);
        }
    });

    this.codemirror = codemirror;
}

/**
 * 设置编辑器脚本代码
 * @param {*} source 源码
 * @param {*} mode 模式 javascript, vertexShader, fragmentShader, json
 * @param {*} cursorPosition 光标位置
 * @param {*} scrollInfo 滚动信息
 */
ScriptEditor.prototype.setValue = function (
    source = '',
    mode = 'javascript',
    cursorPosition = { line: 0, ch: 0 },
    scrollInfo = { left: 0, top: 0 }
) {
    this.source = source;
    this.mode = mode;

    var codemirror = this.codemirror;

    var history = codemirror.getHistory();

    codemirror.setValue(source);

    if (mode === 'json') {
        codemirror.setOption('mode', {
            name: 'javascript',
            json: true
        });
    } else if (mode === 'vertexShader' || mode === 'fragmentShader') {
        codemirror.setOption('mode', 'glsl');
    } else {
        codemirror.setOption('mode', mode);
    }

    codemirror.focus();

    codemirror.setCursor(cursorPosition);
    codemirror.scrollTo(scrollInfo.left, scrollInfo.top);

    codemirror.setHistory(history);
};

/**
 * 获取编辑器脚本代码
 * @returns {String} 脚本
 */
ScriptEditor.prototype.getValue = function () {
    return this.codemirror.getValue();
};

/**
 * 清空编辑器
 */
ScriptEditor.prototype.clear = function () {
    this.setValue();
};

// ---------------------- 内部函数 -----------------------------------------

/**
 * 代码修改事件
 */
ScriptEditor.prototype.onCodeMirrorChange = function () {
    var codemirror = this.codemirror;

    if (codemirror.state.focused === false) {
        return;
    }

    if (this.delay) {
        clearTimeout(this.delay);
    }

    this.delay = setTimeout(() => {
        var code = codemirror.getValue();
        this.validate(code);
    }, this.delayTime);
};

/**
 * 校验编辑器中代码正确性
 * @param {*} string 脚本
 * @returns {Boolean} 是否正确
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

        var i, error;

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

                for (i = 0; i < errors.length; i++) {
                    error = errors[i];
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

        for (i = 0; i < errors.length; i++) {
            error = errors[i];

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