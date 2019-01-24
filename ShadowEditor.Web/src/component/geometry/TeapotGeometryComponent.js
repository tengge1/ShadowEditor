import BaseComponent from '../BaseComponent';
import SetGeometryCommand from '../../command/SetGeometryCommand';

/**
 * 茶壶组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TeapotGeometryComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

TeapotGeometryComponent.prototype = Object.create(BaseComponent.prototype);
TeapotGeometryComponent.prototype.constructor = TeapotGeometryComponent;

TeapotGeometryComponent.prototype.render = function () {
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
                    text: L_SIZE
                }, {
                    xtype: 'number',
                    id: 'size',
                    scope: this.id,
                    value: 3,
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
                    value: 10,
                    range: [1, Infinity],
                    onChange: this.onChangeGeometry.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_BOTTOM
                }, {
                    xtype: 'checkbox',
                    id: 'bottom',
                    scope: this.id,
                    value: true,
                    onChange: this.onChangeGeometry.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_LID
                }, {
                    xtype: 'checkbox',
                    id: 'lid',
                    scope: this.id,
                    value: true,
                    onChange: this.onChangeGeometry.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_BODY
                }, {
                    xtype: 'checkbox',
                    id: 'body',
                    scope: this.id,
                    value: true,
                    onChange: this.onChangeGeometry.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_FIT_LID
                }, {
                    xtype: 'checkbox',
                    id: 'fitLid',
                    scope: this.id,
                    value: true,
                    onChange: this.onChangeGeometry.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_BLINN
                }, {
                    xtype: 'checkbox',
                    id: 'blinn',
                    scope: this.id,
                    value: true,
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

TeapotGeometryComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

TeapotGeometryComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

TeapotGeometryComponent.prototype.updateUI = function () {
    var container = UI.get('geometryPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh && editor.selected.geometry instanceof THREE.TeapotBufferGeometry) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var size = UI.get('size', this.id);
    var segments = UI.get('segments', this.id);
    var bottom = UI.get('bottom', this.id);
    var lid = UI.get('lid', this.id);
    var body = UI.get('body', this.id);
    var fitLid = UI.get('fitLid', this.id);
    var blinn = UI.get('blinn', this.id);

    size.setValue(this.selected.geometry.parameters.size);
    segments.setValue(this.selected.geometry.parameters.segments);
    bottom.setValue(this.selected.geometry.parameters.bottom);
    lid.setValue(this.selected.geometry.parameters.lid);
    body.setValue(this.selected.geometry.parameters.body);
    fitLid.setValue(this.selected.geometry.parameters.fitLid);
    blinn.setValue(this.selected.geometry.parameters.blinn);
};

TeapotGeometryComponent.prototype.onChangeGeometry = function () {
    var size = UI.get('size', this.id);
    var segments = UI.get('segments', this.id);
    var bottom = UI.get('bottom', this.id);
    var lid = UI.get('lid', this.id);
    var body = UI.get('body', this.id);
    var fitLid = UI.get('fitLid', this.id);
    var blinn = UI.get('blinn', this.id);

    var geometry = new THREE.TeapotBufferGeometry(
        size.getValue(),
        segments.getValue(),
        bottom.getValue(),
        lid.getValue(),
        body.getValue(),
        fitLid.getValue(),
        blinn.getValue()
    );

    geometry.type = 'TeapotBufferGeometry';

    geometry.parameters = {
        size: size.getValue(),
        segments: segments.getValue(),
        bottom: bottom.getValue(),
        lid: lid.getValue(),
        body: body.getValue(),
        fitLid: fitLid.getValue(),
        blinn: blinn.getValue()
    };

    this.app.editor.execute(new SetGeometryCommand(this.selected, geometry));
};

export default TeapotGeometryComponent;