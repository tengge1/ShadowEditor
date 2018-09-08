import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 基本信息组件
 * @param {*} options 
 */
function BasicComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

BasicComponent.prototype = Object.create(BaseComponent.prototype);
BasicComponent.prototype.constructor = BasicComponent;

BasicComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'objectPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: 0,
            paddingTop: '20px',
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '基本信息'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '名称'
            }, {
                xtype: 'input',
                id: 'objectName',
                scope: this.id,
                style: {
                    width: '100px',
                    fontSize: '12px'
                },
                onChange: this.onChangeName.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '类型'
            }, {
                xtype: 'text',
                id: 'objectType',
                scope: this.id
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

BasicComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

BasicComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

BasicComponent.prototype.updateUI = function () {
    var container = UI.get('objectPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;
    UI.get('objectName', this.id).setValue(this.selected.name);
    UI.get('objectType', this.id).setValue(this.selected.constructor.name);
};

BasicComponent.prototype.onChangeName = function () {
    var objectName = UI.get('objectName', this.id);
    var editor = this.app.editor;

    editor.execute(new SetValueCommand(this.selected, 'name', objectName.getValue()));
};

export default BasicComponent;