import UI from '../../ui/UI';
import AddScriptCommand from '../../command/AddScriptCommand';
import ScriptWindow from '../script/window/ScriptWindow';

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
    if (this.window == null) {
        this.window = new ScriptWindow({ app: this.app });
        this.window.render();
    }
    this.window.reset();
    this.window.show();
};

ScriptPanel.prototype.createNewCustomScript = function () {
    if (this.window == null) {
        this.window = new ScriptWindow({ app: this.app });
        this.window.render();
    }
    this.window.reset();
    this.window.show();
};


ScriptPanel.prototype.update = function () {
    var scriptsContainer = UI.get('scriptsContainer');
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
                        style: {
                            width: '130px',
                            fontSize: '12px'
                        },
                        onChange: function () {
                            editor.execute(new SetScriptValueCommand(editor.selected, script, 'name', this.getValue()));
                        }
                    }, {
                        xtype: 'button',
                        text: '编辑',
                        style: {
                            marginLeft: '4px'
                        },
                        onClick: function () {
                            _this.app.call('editScript', _this, object, script);
                        }
                    }, {
                        xtype: 'button',
                        text: '删除',
                        style: {
                            marginLeft: '4px'
                        },
                        onClick: function () {
                            UI.confirm('询问', '确定要删除吗？', function (event, btn) {
                                if (btn === 'ok') {
                                    editor.execute(new RemoveScriptCommand(editor.selected, script));
                                }
                            });
                        }
                    }, {
                        xtype: 'br'
                    }]
                };

                UI.create(data).render();
            })(object, scripts[i])
        }
    }
};

export default ScriptPanel;