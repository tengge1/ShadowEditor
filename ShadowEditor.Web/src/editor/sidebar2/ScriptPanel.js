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
            id: 'scriptsContainer'
        }, {
            xtype: 'button',
            id: 'newCustomScript',
            text: '新建脚本',
            onClick: this.createNewScript.bind(this)
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`scriptChanged.${this.id}`, this.update.bind(this));
};

ScriptPanel.prototype.createNewScript = function () {
    if (this.window == null) {
        this.window = new ScriptWindow({
            app: this.app
        });
        this.window.render();
    }
    this.window.reset();
    this.window.show();
};

ScriptPanel.prototype.update = function () {
    var container = UI.get('scriptsContainer');
    container.dom.innerHTML = '';
    container.dom.style.display = 'none';

    var scripts = this.app.editor.scripts;

    if (Object.keys(scripts).length === 0) {
        return;
    }

    container.dom.style.display = 'block';

    Object.keys(scripts).forEach(n => {
        var script = scripts[n];
        var uuid = script.uuid;
        var name = script.name;
        var extension;

        switch (script.type) {
            case 'javascript':
                extension = '.js';
                break;
            case 'vertexShader':
            case 'fragmentShader':
                extension = '.glsl';
                break;
            case 'json':
                extension = '.json';
                break;
        }

        var data = {
            xtype: 'container',
            parent: container.dom,
            children: [{
                xtype: 'text',
                text: name + extension,
                style: {
                    width: '100px',
                    fontSize: '12px'
                }
            }, {
                xtype: 'button',
                text: '编辑',
                style: {
                    marginLeft: '4px'
                },
                onClick: () => {
                    this.editScript(uuid);
                }
            }, {
                xtype: 'button',
                text: '删除',
                style: {
                    marginLeft: '4px'
                },
                onClick: () => {
                    this.deleteScript(uuid);
                }
            }, {
                xtype: 'br'
            }]
        };

        UI.create(data).render();
    });
};

/**
 * 编辑脚本
 * @param {*} uuid 
 */
ScriptPanel.prototype.editScript = function (uuid) {
    var script = this.app.editor.scripts[uuid];
    if (script) {
        this.app.script.open(uuid, script.name, script.type, script.source, script.name);
    }
};

/**
 * 删除脚本
 * @param {*} uuid 
 */
ScriptPanel.prototype.deleteScript = function (uuid) {
    var script = this.app.editor.scripts[uuid];

    UI.confirm('询问', `是否删除脚本${script.name}？`, (event, btn) => {
        if (btn === 'ok') {
            delete this.app.editor.scripts[uuid];
            this.app.call('scriptChange', this);
            UI.msg(`${script.name}删除成功！`);
        }
    });
};

export default ScriptPanel;