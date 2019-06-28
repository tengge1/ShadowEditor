import UI from '../../../ui/UI';
import JavaScriptStarter from '../code/JavaScriptStarter';
import VertexShaderStarter from '../code/VertexShaderStarter';
import FragmentShaderStarter from '../code/FragmentShaderStarter';
import JsonStarter from '../code/JsonStarter';

/**
 * 脚本创建窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ScriptWindow(options = {}) {
    UI.Control.call(this, options);
}

ScriptWindow.prototype = Object.create(UI.Control.prototype);
ScriptWindow.prototype.constructor = ScriptWindow;

ScriptWindow.prototype.render = function () {
    var container = UI.create({
        xtype: 'window',
        id: 'scriptWindow',
        scope: this.id,
        parent: app.container,
        title: L_CREATE_SCRIPT,
        width: '350px',
        height: '220px',
        bodyStyle: {
            paddingTop: '32px'
        },
        shade: false,
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_NAME
            }, {
                xtype: 'input',
                id: 'scriptName',
                scope: this.id,
                text: L_NO_NAME
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_TYPE
            }, {
                xtype: 'select',
                id: 'scriptType',
                scope: this.id,
                options: {
                    'javascript': 'JavaScript',
                    'vertexShader': L_VERTEX_SHADER,
                    'fragmentShader': L_FRAGMENT_SHADER,
                    'json': L_SHADER_PROGRAM_INFO
                },
                value: 'javascript',
                disabled: true
            }]
        }],
        buttons: [{
            xtype: 'button',
            text: L_OK,
            onClick: this.onCreateScript.bind(this)
        }, {
            xtype: 'button',
            text: L_CANCEL,
            onClick: this.onCancelScript.bind(this)
        }]
    });

    container.render();
};

ScriptWindow.prototype.show = function () {
    var container = UI.get('scriptWindow', this.id);
    container.show();
};

ScriptWindow.prototype.hide = function () {
    var container = UI.get('scriptWindow', this.id);
    container.hide();
};

ScriptWindow.prototype.reset = function () {
    var scriptName = UI.get('scriptName', this.id);
    var scriptType = UI.get('scriptType', this.id);

    scriptName.setValue(L_NO_NAME);
    scriptType.setValue('javascript');
};

ScriptWindow.prototype.onCreateScript = function () {
    var scriptName = UI.get('scriptName', this.id).getValue();
    var scriptType = UI.get('scriptType', this.id).getValue();

    // 判断脚本名称是否重复
    var scripts = Object.values(app.editor.scripts);
    if (scripts.filter(n => n.name === scriptName).length > 0) {
        UI.msg(L_SCRIPT_NAME_EXISTED);
        return;
    }

    this.hide();

    var initCode;

    switch (scriptType) {
        case 'javascript':
            initCode = JavaScriptStarter();
            break;
        case 'vertexShader':
            initCode = VertexShaderStarter();
            break;
        case 'fragmentShader':
            initCode = FragmentShaderStarter();
            break;
        case 'json':
            initCode = JsonStarter();
            break;
        default:
            initCode = JavaScriptStarter();
            break;
    }

    var uuid = THREE.Math.generateUUID();

    app.script.open(uuid, scriptName, scriptType, initCode, scriptName, source => {
        var script = app.editor.scripts[uuid];
        script.source = source;
    });

    app.editor.scripts[uuid] = {
        id: 0,
        name: scriptName,
        type: scriptType,
        source: initCode,
        uuid: uuid
    };

    app.call('scriptChanged', this);
};

ScriptWindow.prototype.onCancelScript = function () {
    var container = UI.get('scriptWindow', this.id);
    container.hide();
};

export default ScriptWindow;