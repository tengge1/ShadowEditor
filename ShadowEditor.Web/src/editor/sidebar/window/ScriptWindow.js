import UI from '../../../ui/UI';

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
                    'glsl': '着色器脚本',
                    'json': 'Json'
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
    var scriptName = UI.get('scriptName', this.id);
    var scriptType = UI.get('scriptType', this.id);

    this.hide();

    this.app.script.open(scriptName, scriptType, '', scriptName);
};

ScriptWindow.prototype.onCancelScript = function () {
    var container = UI.get('scriptWindow', this.id);
    container.hide();
};

export default ScriptWindow;