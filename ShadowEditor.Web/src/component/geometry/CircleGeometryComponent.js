import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 圆形组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function CircleGeometryComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

CircleGeometryComponent.prototype = Object.create(BaseComponent.prototype);
CircleGeometryComponent.prototype.constructor = CircleGeometryComponent;

CircleGeometryComponent.prototype.render = function () {
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
                text: L_SEGMENTS
            }, {
                xtype: 'int',
                id: 'segments',
                scope: this.id,
                value: 16,
                range: [3, Infinity],
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_THETA_START
            }, {
                xtype: 'number',
                id: 'thetaStart',
                scope: this.id,
                value: 1,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_THETA_LENGTH
            }, {
                xtype: 'number',
                id: 'thetaLength',
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

CircleGeometryComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

CircleGeometryComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

CircleGeometryComponent.prototype.updateUI = function () {
    var container = UI.get('geometryPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh && editor.selected.geometry instanceof THREE.CircleBufferGeometry) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var radius = UI.get('radius', this.id);
    var segments = UI.get('segments', this.id);
    var thetaStart = UI.get('thetaStart', this.id);
    var thetaLength = UI.get('thetaLength', this.id);

    radius.setValue(this.selected.geometry.parameters.radius);
    segments.setValue(this.selected.geometry.parameters.segments);
    thetaStart.setValue(this.selected.geometry.parameters.thetaStart === undefined ? 0 : this.selected.geometry.parameters.thetaStart);
    thetaLength.setValue(this.selected.geometry.parameters.thetaLength === undefined ? Math.PI * 2 : this.selected.geometry.parameters.thetaLength);
};

CircleGeometryComponent.prototype.onChangeGeometry = function () {
    var radius = UI.get('radius', this.id);
    var segments = UI.get('segments', this.id);
    var thetaStart = UI.get('thetaStart', this.id);
    var thetaLength = UI.get('thetaLength', this.id);

    this.app.editor.execute(new SetGeometryCommand(this.selected, new THREE.CircleBufferGeometry(
        radius.getValue(),
        segments.getValue(),
        thetaStart.getValue(),
        thetaLength.getValue()
    )));
};

export default CircleGeometryComponent;