import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 材质组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function MaterialComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

MaterialComponent.prototype = Object.create(BaseComponent.prototype);
MaterialComponent.prototype.constructor = MaterialComponent;

MaterialComponent.prototype.render = function () {
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

MaterialComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

MaterialComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

MaterialComponent.prototype.updateUI = function () {
    var container = UI.get('objectPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

};

export default MaterialComponent;