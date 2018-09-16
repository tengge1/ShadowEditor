import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';
import RemoveObjectCommand from '../command/RemoveObjectCommand';
import AddObjectCommand from '../command/AddObjectCommand';

/**
 * 基本信息组件
 * @author tengge / https://github.com/tengge1
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
        id: 'basicPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: 0,
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
                id: 'name',
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
                id: 'type',
                scope: this.id
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '可见性'
            }, {
                xtype: 'checkbox',
                id: 'visible',
                scope: this.id,
                onChange: this.onChangeVisible.bind(this)
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
    var container = UI.get('basicPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var name = UI.get('name', this.id);
    var type = UI.get('type', this.id);
    var visible = UI.get('visible', this.id);

    name.setValue(this.selected.name);
    type.setValue(this.selected.constructor.name);
    visible.setValue(this.selected.visible);
};

BasicComponent.prototype.onChangeName = function () {
    var name = UI.get('name', this.id);
    var editor = this.app.editor;

    editor.execute(new SetValueCommand(this.selected, 'name', name.getValue()));
};

BasicComponent.prototype.onChangeVisible = function () {
    this.selected.visible = UI.get('visible', this.id).getValue();
};

export default BasicComponent;