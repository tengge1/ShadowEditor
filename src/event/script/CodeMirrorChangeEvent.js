import BaseEvent from '../BaseEvent';
import SetScriptValueCommand from '../../command/SetScriptValueCommand';
import SetMaterialValueCommand from '../../command/SetMaterialValueCommand';

/**
 * CodeMirror改变事件
 * @param {*} app 
 */
function CodeMirrorChangeEvent(app) {
    BaseEvent.call(this, app);
    this.delay = null;
    this.errorLines = [];
    this.widgets = [];
}

CodeMirrorChangeEvent.prototype = Object.create(BaseEvent.prototype);
CodeMirrorChangeEvent.prototype.constructor = CodeMirrorChangeEvent;

CodeMirrorChangeEvent.prototype.start = function () {
    var _this = this;
    this.app.on('codeMirrorChange.' + this.id, function (codemirror, currentMode, currentScript, currentObject) {
        _this.onCodeMirrorChange(codemirror, currentMode, currentScript, currentObject);
    });
};

CodeMirrorChangeEvent.prototype.stop = function () {
    this.app.on('codeMirrorChange.' + this.id, null);
};

CodeMirrorChangeEvent.prototype.onCodeMirrorChange = function (codemirror, currentMode, currentScript, currentObject) {
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

CodeMirrorChangeEvent.prototype.validate = function (codemirror, currentMode, currentObject, string) {
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

export default CodeMirrorChangeEvent;