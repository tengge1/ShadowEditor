import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 二十面体组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function IcosahedronGeometryComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

IcosahedronGeometryComponent.prototype = Object.create(BaseComponent.prototype);
IcosahedronGeometryComponent.prototype.constructor = IcosahedronGeometryComponent;

IcosahedronGeometryComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        id: 'geometryPanel',
        scope: this.id,
        style: {
            borderTop: 0,
            marginTop: '8px',
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_RADIUS
            }, {
                xtype: 'number',
                id: 'radius',
                scope: this.id,
                value: 1,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_DETAIL
            }, {
                xtype: 'int',
                id: 'detail',
                scope: this.id,
                value: 1,
                range: [0, Infinity],
                onChange: this.onChangeGeometry.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

IcosahedronGeometryComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

IcosahedronGeometryComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

IcosahedronGeometryComponent.prototype.updateUI = function () {
    var container = UI.get('geometryPanel', this.id);
    var editor = app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh && editor.selected.geometry instanceof THREE.IcosahedronBufferGeometry) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var radius = UI.get('radius', this.id);
    var detail = UI.get('detail', this.id);

    radius.setValue(this.selected.geometry.parameters.radius);
    detail.setValue(this.selected.geometry.parameters.detail);
};

IcosahedronGeometryComponent.prototype.onChangeGeometry = function () {
    var radius = UI.get('radius', this.id);
    var detail = UI.get('detail', this.id);

    app.editor.execute(new SetGeometryCommand(this.selected, new THREE.IcosahedronBufferGeometry(
        radius.getValue(),
        detail.getValue()
    )));
};

export default IcosahedronGeometryComponent;