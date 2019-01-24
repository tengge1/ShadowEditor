import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 花托组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TorusGeometryComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

TorusGeometryComponent.prototype = Object.create(BaseComponent.prototype);
TorusGeometryComponent.prototype.constructor = TorusGeometryComponent;

TorusGeometryComponent.prototype.render = function () {
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
                text: L_TUBE
            }, {
                xtype: 'number',
                id: 'tube',
                scope: this.id,
                value: 1,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_RADIAL_SEGMENTS
            }, {
                xtype: 'int',
                id: 'radialSegments',
                scope: this.id,
                value: 16,
                range: [1, Infinity],
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_TUBULAR_SEGMENTS
            }, {
                xtype: 'int',
                id: 'tubularSegments',
                scope: this.id,
                value: 16,
                range: [1, Infinity],
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ARC
            }, {
                xtype: 'number',
                id: 'arc',
                scope: this.id,
                value: Math.PI * 2,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

TorusGeometryComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

TorusGeometryComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

TorusGeometryComponent.prototype.updateUI = function () {
    var container = UI.get('geometryPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh && editor.selected.geometry instanceof THREE.TorusBufferGeometry) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var radius = UI.get('radius', this.id);
    var tube = UI.get('tube', this.id);
    var radialSegments = UI.get('radialSegments', this.id);
    var tubularSegments = UI.get('tubularSegments', this.id);
    var arc = UI.get('arc', this.id);

    radius.setValue(this.selected.geometry.parameters.radius);
    tube.setValue(this.selected.geometry.parameters.tube);
    radialSegments.setValue(this.selected.geometry.parameters.radialSegments);
    tubularSegments.setValue(this.selected.geometry.parameters.tubularSegments);
    arc.setValue(this.selected.geometry.parameters.arc);
};

TorusGeometryComponent.prototype.onChangeGeometry = function () {
    var radius = UI.get('radius', this.id);
    var tube = UI.get('tube', this.id);
    var radialSegments = UI.get('radialSegments', this.id);
    var tubularSegments = UI.get('tubularSegments', this.id);
    var arc = UI.get('arc', this.id);

    this.app.editor.execute(new SetGeometryCommand(this.selected, new THREE.TorusBufferGeometry(
        radius.getValue(),
        tube.getValue(),
        radialSegments.getValue(),
        tubularSegments.getValue(),
        arc.getValue()
    )));
};

export default TorusGeometryComponent;