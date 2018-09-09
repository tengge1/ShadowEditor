import BaseComponent from '../BaseComponent';
import SetValueCommand from '../../command/SetValueCommand';

/**
 * 平板组件
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
            children: []
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
    var container = UI.get('geometryPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh && editor.selected.geometry instanceof THREE.PlaneBufferGeometry) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;
};

export default PlaneGeometryComponent;