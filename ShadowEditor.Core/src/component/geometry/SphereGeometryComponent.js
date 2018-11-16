import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 球体组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SphereGeometryComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

SphereGeometryComponent.prototype = Object.create(BaseComponent.prototype);
SphereGeometryComponent.prototype.constructor = SphereGeometryComponent;

SphereGeometryComponent.prototype.render = function () {
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
                text: '半径'
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
                text: '宽度分段'
            }, {
                xtype: 'int',
                id: 'widthSegments',
                scope: this.id,
                value: 1,
                range: [1, Infinity],
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '高度分段'
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
                text: '开始经度'
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
                text: '转过经度'
            }, {
                xtype: 'number',
                id: 'phiLength',
                scope: this.id,
                value: Math.PI * 2,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '开始纬度'
            }, {
                xtype: 'number',
                id: 'thetaStart',
                scope: this.id,
                value: 0,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '转过纬度'
            }, {
                xtype: 'number',
                id: 'thetaLength',
                scope: this.id,
                value: Math.PI / 2,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

SphereGeometryComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

SphereGeometryComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

SphereGeometryComponent.prototype.updateUI = function () {
    var container = UI.get('geometryPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh && editor.selected.geometry instanceof THREE.SphereBufferGeometry) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var radius = UI.get('radius', this.id);
    var widthSegments = UI.get('widthSegments', this.id);
    var heightSegments = UI.get('heightSegments', this.id);
    var phiStart = UI.get('phiStart', this.id);
    var phiLength = UI.get('phiLength', this.id);
    var thetaStart = UI.get('thetaStart', this.id);
    var thetaLength = UI.get('thetaLength', this.id);

    radius.setValue(this.selected.geometry.parameters.radius);
    widthSegments.setValue(this.selected.geometry.parameters.widthSegments);
    heightSegments.setValue(this.selected.geometry.parameters.heightSegments);
    phiStart.setValue(this.selected.geometry.parameters.phiStart);
    phiLength.setValue(this.selected.geometry.parameters.phiLength);
    thetaStart.setValue(this.selected.geometry.parameters.thetaStart);
    thetaLength.setValue(this.selected.geometry.parameters.thetaLength);
};

SphereGeometryComponent.prototype.onChangeGeometry = function () {
    var radius = UI.get('radius', this.id);
    var widthSegments = UI.get('widthSegments', this.id);
    var heightSegments = UI.get('heightSegments', this.id);
    var phiStart = UI.get('phiStart', this.id);
    var phiLength = UI.get('phiLength', this.id);
    var thetaStart = UI.get('thetaStart', this.id);
    var thetaLength = UI.get('thetaLength', this.id);

    this.app.editor.execute(new SetGeometryCommand(this.selected, new THREE.SphereBufferGeometry(
        radius.getValue(),
        widthSegments.getValue(),
        heightSegments.getValue(),
        phiStart.getValue(),
        phiLength.getValue(),
        thetaStart.getValue(),
        thetaLength.getValue()
    )));
};

export default SphereGeometryComponent;