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
        id: 'scriptPanel',
        parent: this.parent,
        cls: 'Panel scriptPanel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'label',
            text: '脚本'
        }, {
            xtype: 'br'
        }, {
            xtype: 'br'
        }, {
            xtype: 'row',
            id: 'scriptsContainer'
        }, {
            xtype: 'button',
            id: 'newScript',
            text: '新建',
            onClick: function () {
                var script = { name: '', source: 'function update( event ) {}' };
                editor.execute(new AddScriptCommand(editor.selected, script));
            }
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default ScriptPanel;