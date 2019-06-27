import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 圆柱组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function CylinderGeometryComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

CylinderGeometryComponent.prototype = Object.create(BaseComponent.prototype);
CylinderGeometryComponent.prototype.constructor = CylinderGeometryComponent;

CylinderGeometryComponent.prototype.render = function () {
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
                text: L_RADIUS_TOP
            }, {
                xtype: 'number',
                id: 'radiusTop',
                scope: this.id,
                value: 1,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_RADIUS_BOTTOM
            }, {
                xtype: 'number',
                id: 'radiusBottom',
                scope: this.id,
                value: 1,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_HEIGHT
            }, {
                xtype: 'number',
                id: 'height',
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
                text: L_HEIGHT_SEGMENTS
            }, {
                xtype: 'int',
                id: 'heightSegments',
                scope: this.id,
                value: 1,
                range: [1, Infinity],
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_OPEN_ENDED
            }, {
                xtype: 'checkbox',
                id: 'openEnded',
                scope: this.id,
                value: false,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

CylinderGeometryComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

CylinderGeometryComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

CylinderGeometryComponent.prototype.updateUI = function () {
    var container = UI.get('geometryPanel', this.id);
    var editor = app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh && editor.selected.geometry instanceof THREE.CylinderBufferGeometry) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var radiusTop = UI.get('radiusTop', this.id);
    var radiusBottom = UI.get('radiusBottom', this.id);
    var height = UI.get('height', this.id);
    var radialSegments = UI.get('radialSegments', this.id);
    var heightSegments = UI.get('heightSegments', this.id);
    var openEnded = UI.get('openEnded', this.id);

    radiusTop.setValue(this.selected.geometry.parameters.radiusTop);
    radiusBottom.setValue(this.selected.geometry.parameters.radiusBottom);
    height.setValue(this.selected.geometry.parameters.height);
    radialSegments.setValue(this.selected.geometry.parameters.radialSegments);
    heightSegments.setValue(this.selected.geometry.parameters.heightSegments);
    openEnded.setValue(this.selected.geometry.parameters.openEnded);
};

CylinderGeometryComponent.prototype.onChangeGeometry = function () {
    var radiusTop = UI.get('radiusTop', this.id);
    var radiusBottom = UI.get('radiusBottom', this.id);
    var height = UI.get('height', this.id);
    var radialSegments = UI.get('radialSegments', this.id);
    var heightSegments = UI.get('heightSegments', this.id);
    var openEnded = UI.get('openEnded', this.id);

    app.editor.execute(new SetGeometryCommand(this.selected, new THREE.CylinderBufferGeometry(
        radiusTop.getValue(),
        radiusBottom.getValue(),
        height.getValue(),
        radialSegments.getValue(),
        heightSegments.getValue(),
        openEnded.getValue()
    )));
};

export default CylinderGeometryComponent;