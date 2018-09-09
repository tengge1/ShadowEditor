import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 环面纽结组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TorusKnotGeometryComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

TorusKnotGeometryComponent.prototype = Object.create(BaseComponent.prototype);
TorusKnotGeometryComponent.prototype.constructor = TorusKnotGeometryComponent;

TorusKnotGeometryComponent.prototype.render = function () {
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
                value: 16,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '管粗'
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
                text: '管长分段'
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
                text: '管粗分段'
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
                text: '管长弧度'
            }, {
                xtype: 'number',
                id: 'p',
                scope: this.id,
                value: 20,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '扭曲弧度'
            }, {
                xtype: 'number',
                id: 'q',
                scope: this.id,
                value: 20,
                onChange: this.onChangeGeometry.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

TorusKnotGeometryComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

TorusKnotGeometryComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

TorusKnotGeometryComponent.prototype.updateUI = function () {
    var container = UI.get('geometryPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh && editor.selected.geometry instanceof THREE.TorusKnotBufferGeometry) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var radius = UI.get('radius', this.id);
    var tube = UI.get('tube', this.id);
    var tubularSegments = UI.get('tubularSegments', this.id);
    var radialSegments = UI.get('radialSegments', this.id);
    var p = UI.get('p', this.id);
    var q = UI.get('q', this.id);

    radius.setValue(this.selected.geometry.parameters.radius);
    tube.setValue(this.selected.geometry.parameters.tube);
    tubularSegments.setValue(this.selected.geometry.parameters.tubularSegments);
    radialSegments.setValue(this.selected.geometry.parameters.radialSegments);
    p.setValue(this.selected.geometry.parameters.p);
    q.setValue(this.selected.geometry.parameters.q);
};

TorusKnotGeometryComponent.prototype.onChangeGeometry = function () {
    var radius = UI.get('radius', this.id);
    var tube = UI.get('tube', this.id);
    var tubularSegments = UI.get('tubularSegments', this.id);
    var radialSegments = UI.get('radialSegments', this.id);
    var p = UI.get('p', this.id);
    var q = UI.get('q', this.id);

    this.app.editor.execute(new SetGeometryCommand(this.selected, new THREE.TorusKnotBufferGeometry(
        radius.getValue(),
        tube.getValue(),
        tubularSegments.getValue(),
        radialSegments.getValue(),
        p.getValue(),
        q.getValue()
    )));
};

export default TorusKnotGeometryComponent;