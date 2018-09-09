import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 基本信息组件
 * @param {*} options 
 */
function PlaneGeometryComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

PlaneGeometryComponent.prototype = Object.create(BaseComponent.prototype);
PlaneGeometryComponent.prototype.constructor = PlaneGeometryComponent;

PlaneGeometryComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'objectPanel',
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
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '可见性'
            }, {
                xtype: 'checkbox',
                id: 'objectVisible',
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

PlaneGeometryComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

PlaneGeometryComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

PlaneGeometryComponent.prototype.updateUI = function () {
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
    UI.get('objectVisible', this.id).setValue(this.selected.visible);
};

PlaneGeometryComponent.prototype.onChangeName = function () {
    var objectName = UI.get('objectName', this.id);
    var editor = this.app.editor;

    editor.execute(new SetValueCommand(this.selected, 'name', objectName.getValue()));
};

PlaneGeometryComponent.prototype.onChangeVisible = function () {
    this.selected.visible = UI.get('objectVisible', this.id).getValue();
};

export default PlaneGeometryComponent;