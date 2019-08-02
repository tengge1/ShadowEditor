import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 车床组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function LatheGeometryComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

LatheGeometryComponent.prototype = Object.create(BaseComponent.prototype);
LatheGeometryComponent.prototype.constructor = LatheGeometryComponent;

LatheGeometryComponent.prototype.render = function () {
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
                text: L_RADIAL_SEGMENTS
            }, {
                xtype: 'int',
                id: 'segments',
                scope: this.id,
                value: 16,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_PHI_START
            }, {
                xtype: 'number',
                id: 'phiStart',
                scope: this.id,
                value: 0,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_PHI_LENGTH
            }, {
                xtype: 'number',
                id: 'phiLength',
                scope: this.id,
                value: Math.PI * 2,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

LatheGeometryComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

LatheGeometryComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

LatheGeometryComponent.prototype.updateUI = function () {
    var container = UI.get('geometryPanel', this.id);
    var editor = app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh && editor.selected.geometry instanceof THREE.LatheBufferGeometry) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var segments = UI.get('segments', this.id);
    var phiStart = UI.get('phiStart', this.id);
    var phiLength = UI.get('phiLength', this.id);

    segments.setValue(this.selected.geometry.parameters.segments);
    phiStart.setValue(this.selected.geometry.parameters.phiStart);
    phiLength.setValue(this.selected.geometry.parameters.phiLength);
};

LatheGeometryComponent.prototype.onChangeGeometry = function () {
    var segments = UI.get('segments', this.id);
    var phiStart = UI.get('phiStart', this.id);
    var phiLength = UI.get('phiLength', this.id);

    var points = this.selected.geometry.parameters.points;

    app.editor.execute(new SetGeometryCommand(this.selected, new THREE.LatheBufferGeometry(
        points,
        segments.getValue(),
        phiStart.getValue(),
        phiLength.getValue()
    )));
};

export default LatheGeometryComponent;