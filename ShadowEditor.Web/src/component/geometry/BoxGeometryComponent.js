import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 正方体组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function BoxGeometryComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

BoxGeometryComponent.prototype = Object.create(BaseComponent.prototype);
BoxGeometryComponent.prototype.constructor = BoxGeometryComponent;

BoxGeometryComponent.prototype.render = function () {
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
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_WIDTH
                }, {
                    xtype: 'number',
                    id: 'width',
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
                    text: L_DEPTH
                }, {
                    xtype: 'number',
                    id: 'depth',
                    scope: this.id,
                    value: 1,
                    onChange: this.onChangeGeometry.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_WIDTH_SEGMENTS
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
                    text: L_DEPTH_SEGMENTS
                }, {
                    xtype: 'int',
                    id: 'depthSegments',
                    scope: this.id,
                    value: 1,
                    range: [1, Infinity],
                    onChange: this.onChangeGeometry.bind(this)
                }]
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

BoxGeometryComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

BoxGeometryComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

BoxGeometryComponent.prototype.updateUI = function () {
    var container = UI.get('geometryPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh && editor.selected.geometry instanceof THREE.BoxBufferGeometry) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var width = UI.get('width', this.id);
    var height = UI.get('height', this.id);
    var depth = UI.get('depth', this.id);
    var widthSegments = UI.get('widthSegments', this.id);
    var heightSegments = UI.get('heightSegments', this.id);
    var depthSegments = UI.get('depthSegments', this.id);

    width.setValue(this.selected.geometry.parameters.width);
    height.setValue(this.selected.geometry.parameters.height);
    depth.setValue(this.selected.geometry.parameters.depth);
    widthSegments.setValue(this.selected.geometry.parameters.widthSegments);
    heightSegments.setValue(this.selected.geometry.parameters.heightSegments);
    depthSegments.setValue(this.selected.geometry.parameters.depthSegments);
};

BoxGeometryComponent.prototype.onChangeGeometry = function () {
    var width = UI.get('width', this.id);
    var height = UI.get('height', this.id);
    var depth = UI.get('depth', this.id);
    var widthSegments = UI.get('widthSegments', this.id);
    var heightSegments = UI.get('heightSegments', this.id);
    var depthSegments = UI.get('depthSegments', this.id);

    this.app.editor.execute(new SetGeometryCommand(this.selected, new THREE.BoxBufferGeometry(
        width.getValue(),
        height.getValue(),
        depth.getValue(),
        widthSegments.getValue(),
        heightSegments.getValue(),
        depthSegments.getValue()
    )));
};

export default BoxGeometryComponent;