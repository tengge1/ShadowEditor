import BaseEvent from '../BaseEvent';
import XType from '../../ui/XType';
import SetScriptValueCommand from '../../command/SetScriptValueCommand';
import RemoveScriptCommand from '../../command/RemoveScriptCommand';

/**
 * 脚本面板事件
 * @param {*} app 
 */
function ScriptPanelEvent(app) {
    BaseEvent.call(this, app);
}

ScriptPanelEvent.prototype = Object.create(BaseEvent.prototype);
ScriptPanelEvent.prototype.constructor = ScriptPanelEvent;

ScriptPanelEvent.prototype.start = function () {
    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`scriptAdded.${this.id}`, this.update.bind(this));
    this.app.on(`scriptRemoved.${this.id}`, this.update.bind(this));
    this.app.on(`scriptChanged.${this.id}`, this.update.bind(this));
};

ScriptPanelEvent.prototype.stop = function () {
    this.app.on(`objectSelected.${this.id}`, null);
    this.app.on(`scriptAdded.${this.id}`, null);
    this.app.on(`scriptRemoved.${this.id}`, null);
    this.app.on(`scriptChanged.${this.id}`, null);
};

ScriptPanelEvent.prototype.onObjectSelected = function (object) {
    var container = XType.getControl('scriptPanel');

    if (object !== null) {
        container.dom.style.display = 'block';
        this.update();
    } else {
        container.dom.style.display = 'none';
    }
};

ScriptPanelEvent.prototype.update = function () {
    var scriptsContainer = XType.getControl('scriptsContainer');
    var editor = this.app.editor;
    var _this = this;

    scriptsContainer.dom.innerHTML = '';
    scriptsContainer.dom.style.display = 'none';

    var object = editor.selected;
    if (object === null) {
        return;
    }

    var scripts = editor.scripts[object.uuid];

    if (scripts !== undefined) {
        scriptsContainer.dom.style.display = 'block';

        for (var i = 0; i < scripts.length; i++) {
            (function (object, script) {
                var data = {
                    xtype: 'container',
                    parent: scriptsContainer.dom,
                    children: [{
                        xtype: 'input',
                        value: script.name,
                        style: 'width: 130px; font-size: 12px;',
                        onChange: function () {
                            editor.execute(new SetScriptValueCommand(editor.selected, script, 'name', this.getValue()));
                        }
                    }, {
                        xtype: 'button',
                        text: '编辑',
                        style: 'margin-left: 4px;',
                        onClick: function () {
                            _this.app.call('editScript', _this, object, script);
                        }
                    }, {
                        xtype: 'button',
                        text: '删除',
                        style: 'margin-left: 4px;',
                        onClick: function () {
                            if (confirm('确定吗？')) {
                                editor.execute(new RemoveScriptCommand(editor.selected, script));
                            }
                        }
                    }, {
                        xtype: 'br'
                    }]
                };

                XType.create(data).render();
            })(object, scripts[i])
        }
    }
};

export default ScriptPanelEvent;