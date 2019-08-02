import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 相机组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function CameraComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

CameraComponent.prototype = Object.create(BaseComponent.prototype);
CameraComponent.prototype.constructor = CameraComponent;

CameraComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'cameraPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: L_CAMERA_COMPONENT
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_FOV
            }, {
                xtype: 'number',
                id: 'objectFov',
                scope: this.id,
                onChange: this.onSetObjectFov.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_NEAR
            }, {
                xtype: 'number',
                id: 'objectNear',
                scope: this.id,
                onChange: this.onSetObjectNear.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_FAR
            }, {
                xtype: 'number',
                id: 'objectFar',
                scope: this.id,
                onChange: this.onSetObjectFar.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`objectSelected.CameraComponent`, this.onObjectSelected.bind(this));
    app.on(`objectChanged.CameraComponent`, this.onObjectChanged.bind(this));
};

CameraComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

CameraComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

CameraComponent.prototype.updateUI = function () {
    var container = UI.get('cameraPanel', this.id);
    var editor = app.editor;
    if (editor.selected && editor.selected instanceof THREE.PerspectiveCamera) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var objectFov = UI.get('objectFov', this.id);
    var objectNear = UI.get('objectNear', this.id);
    var objectFar = UI.get('objectFar', this.id);

    objectFov.setValue(this.selected.fov);
    objectNear.setValue(this.selected.near);
    objectFar.setValue(this.selected.far);
};

CameraComponent.prototype.onSetObjectFov = function () {
    var fov = UI.get('objectFov', this.id).getValue();
    app.editor.execute(new SetValueCommand(this.selected, 'fov', fov));
};

CameraComponent.prototype.onSetObjectNear = function () {
    var near = UI.get('objectNear', this.id).getValue();
    app.editor.execute(new SetValueCommand(this.selected, 'near', near));
};

CameraComponent.prototype.onSetObjectFar = function () {
    var far = UI.get('objectFar', this.id).getValue();
    app.editor.execute(new SetValueCommand(this.selected, 'far', far));
};

export default CameraComponent;