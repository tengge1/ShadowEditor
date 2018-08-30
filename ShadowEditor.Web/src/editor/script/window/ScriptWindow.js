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
function ScriptWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

ScriptWindow.prototype = Object.create(UI.Control.prototype);
ScriptWindow.prototype.constructor = ScriptWindow;

ScriptWindow.prototype.render = function () {
    var container = UI.create({
        xtype: 'window',
        id: 'scriptWindow',
        scope: this.id,
        parent: this.app.container,
        title: '创建脚本',
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
                text: '名称'
            }, {
                xtype: 'input',
                id: 'scriptName',
                scope: this.id,
                text: '未命名'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '类型'
            }, {
                xtype: 'select',
                id: 'scriptType',
                scope: this.id,
                options: {
                    'javascript': 'JavaScript',
                    'vertexShader': '顶点着色器',
                    'fragmentShader': '片源着色器',
                    'json': '着色器程序信息'
                },
                value: 'javascript'
            }]
        }],
        buttons: [{
            xtype: 'button',
            text: '确定',
            onClick: this.onCreateScript.bind(this)
        }, {
            xtype: 'button',
            text: '取消',
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

    scriptName.setValue('未命名');
    scriptType.setValue('javascript');
};

ScriptWindow.prototype.onCreateScript = function () {
    var scriptName = UI.get('scriptName', this.id).getValue();
    var scriptType = UI.get('scriptType', this.id).getValue();

    this.hide();

    var initCode;

    switch (scriptType) {
        case 'javascript':
            initCode = JavaScriptStarter;
            break;
        case 'vertexShader':
            initCode = VertexShaderStarter;
            break;
        case 'fragmentShader':
            initCode = FragmentShaderStarter;
            break;
        case 'json':
            initCode = JsonStarter;
            break;
        default:
            initCode = JavaScriptStarter;
            break;
    }

    this.app.script.open(scriptName, scriptType, initCode, scriptName);
};

ScriptWindow.prototype.onCancelScript = function () {
    var container = UI.get('scriptWindow', this.id);
    container.hide();
};

export default ScriptWindow;