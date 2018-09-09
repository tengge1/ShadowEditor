import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

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
                    text: '宽度'
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
                    text: '高度'
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
            }]
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

    var width = UI.get('width', this.id);
    var height = UI.get('height', this.id);
    var widthSegments = UI.get('widthSegments', this.id);
    var heightSegments = UI.get('heightSegments', this.id);

    width.setValue(this.selected.geometry.parameters.width);
    height.setValue(this.selected.geometry.parameters.height);
    widthSegments.setValue(this.selected.geometry.parameters.widthSegments);
    heightSegments.setValue(this.selected.geometry.parameters.heightSegments);
};

PlaneGeometryComponent.prototype.onChangeGeometry = function () {
    var width = UI.get('width', this.id);
    var height = UI.get('height', this.id);
    var widthSegments = UI.get('widthSegments', this.id);
    var heightSegments = UI.get('heightSegments', this.id);

    this.app.editor.execute(new SetGeometryCommand(this.selected, new THREE.PlaneBufferGeometry(
        width.getValue(),
        height.getValue(),
        widthSegments.getValue(),
        heightSegments.getValue()
    )));
};

export default PlaneGeometryComponent;