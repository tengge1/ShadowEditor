import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 几何体组件
 * @param {*} options 
 */
function GeometryComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

GeometryComponent.prototype = Object.create(BaseComponent.prototype);
GeometryComponent.prototype.constructor = GeometryComponent;

GeometryComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'geometryPanel',
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
                text: '几何组件'
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

GeometryComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

GeometryComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

GeometryComponent.prototype.updateUI = function () {
    var container = UI.get('geometryPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;
};

export default GeometryComponent;