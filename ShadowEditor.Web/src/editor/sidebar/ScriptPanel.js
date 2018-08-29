import UI from '../../ui/UI';
import AddScriptCommand from '../../command/AddScriptCommand';

/**
 * 脚本面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function ScriptPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

ScriptPanel.prototype = Object.create(UI.Control.prototype);
ScriptPanel.prototype.constructor = ScriptPanel;

ScriptPanel.prototype.render = function () {
    var editor = this.app.editor;

    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'Panel scriptPanel',
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '常用脚本'
            }]
        }, {
            xtype: 'row',
            id: 'commonScriptContainer'
        }, {
            xtype: 'button',
            id: 'newCommonScript',
            text: '新建脚本',
            onClick: this.createNewCommonScript.bind(this)
        }, {
            xtype: 'row',
            style: {
                paddingTop: '5px',
            },
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '自定义脚本'
            }]
        }, {
            xtype: 'row',
            id: 'customScriptContainer'
        }, {
            xtype: 'button',
            id: 'newCustomScript',
            text: '新建脚本',
            onClick: this.createNewCustomScript.bind(this)
        }]
    };

    var control = UI.create(data);
    control.render();
};

ScriptPanel.prototype.createNewCommonScript = function () {
    // var script = { name: '', source: 'function update( event ) {}' };
    // editor.execute(new AddScriptCommand(editor.selected, script));
};

ScriptPanel.prototype.createNewCustomScript = function () {
    // var script = { name: '', source: 'function update( event ) {}' };
    // editor.execute(new AddScriptCommand(editor.selected, script));
};

export default ScriptPanel;