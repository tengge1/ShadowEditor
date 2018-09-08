import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';
import SetPositionCommand from '../command/SetPositionCommand';
import SetRotationCommand from '../command/SetRotationCommand';
import SetScaleCommand from '../command/SetScaleCommand';

/**
 * 位移组件
 * @param {*} options 
 */
function TransformComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

TransformComponent.prototype = Object.create(BaseComponent.prototype);
TransformComponent.prototype.constructor = TransformComponent;

TransformComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'transformPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: 0,
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    style: {
                        color: '#555',
                        fontWeight: 'bold'
                    },
                    text: '位移组件'
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '平移'
                }, {
                    xtype: 'number',
                    id: 'objectPositionX',
                    scope: this.id,
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangePosition.bind(this)
                }, {
                    xtype: 'number',
                    id: 'objectPositionY',
                    scope: this.id,
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangePosition.bind(this)
                }, {
                    xtype: 'number',
                    id: 'objectPositionZ',
                    scope: this.id,
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangePosition.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '旋转'
                }, {
                    xtype: 'number',
                    id: 'objectRotationX',
                    scope: this.id,
                    step: 10,
                    unit: '°',
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangeRotation.bind(this)
                }, {
                    xtype: 'number',
                    id: 'objectRotationY',
                    scope: this.id,
                    step: 10,
                    unit: '°',
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangeRotation.bind(this)
                }, {
                    xtype: 'number',
                    id: 'objectRotationZ',
                    scope: this.id,
                    step: 10,
                    unit: '°',
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangeRotation.bind(this)
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '缩放'
                }, {
                    xtype: 'checkbox',
                    id: 'objectScaleLock',
                    scope: this.id,
                    value: true,
                    style: {
                        position: 'absolute',
                        left: '50px'
                    }
                }, {
                    xtype: 'number',
                    id: 'objectScaleX',
                    scope: this.id,
                    value: 1,
                    range: [0.01, Infinity],
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangeScale.bind(this)
                }, {
                    xtype: 'number',
                    id: 'objectScaleY',
                    scope: this.id,
                    value: 1,
                    range: [0.01, Infinity],
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangeScale.bind(this)
                }, {
                    xtype: 'number',
                    id: 'objectScaleZ',
                    scope: this.id,
                    value: 1,
                    range: [0.01, Infinity],
                    style: {
                        width: '40px'
                    },
                    onChange: this.onChangeScale.bind(this)
                }]
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

TransformComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

TransformComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

TransformComponent.prototype.updateUI = function () {
    var container = UI.get('transformPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var objectPositionX = UI.get('objectPositionX', this.id);
    var objectPositionY = UI.get('objectPositionY', this.id);
    var objectPositionZ = UI.get('objectPositionZ', this.id);

    var objectRotationX = UI.get('objectRotationX', this.id);
    var objectRotationY = UI.get('objectRotationY', this.id);
    var objectRotationZ = UI.get('objectRotationZ', this.id);

    var objectScaleX = UI.get('objectScaleX', this.id);
    var objectScaleY = UI.get('objectScaleY', this.id);
    var objectScaleZ = UI.get('objectScaleZ', this.id);

    objectPositionX.setValue(this.selected.position.x);
    objectPositionY.setValue(this.selected.position.y);
    objectPositionZ.setValue(this.selected.position.z);

    objectRotationX.setValue(this.selected.rotation.x * 180 / Math.PI);
    objectRotationY.setValue(this.selected.rotation.y * 180 / Math.PI);
    objectRotationZ.setValue(this.selected.rotation.z * 180 / Math.PI);

    objectScaleX.setValue(this.selected.scale.x);
    objectScaleY.setValue(this.selected.scale.y);
    objectScaleZ.setValue(this.selected.scale.z);
};

TransformComponent.prototype.onChangePosition = function () {
    var x = UI.get('objectPositionX', this.id).getValue();
    var y = UI.get('objectPositionY', this.id).getValue();
    var z = UI.get('objectPositionZ', this.id).getValue();

    this.app.editor.execute(new SetPositionCommand(this.selected, new THREE.Vector3(x, y, z)));
};

TransformComponent.prototype.onChangeRotation = function () {
    var x = UI.get('objectRotationX', this.id).getValue();
    var y = UI.get('objectRotationY', this.id).getValue();
    var z = UI.get('objectRotationZ', this.id).getValue();

    this.app.editor.execute(new SetRotationCommand(this.selected, new THREE.Euler(x * Math.PI / 180, y * Math.PI / 180, z * Math.PI / 180)));
};

TransformComponent.prototype.onChangeScale = function (value) {
    var x = UI.get('objectScaleX', this.id).getValue();
    var y = UI.get('objectScaleY', this.id).getValue();
    var z = UI.get('objectScaleZ', this.id).getValue();
    var locked = UI.get('objectScaleLock', this.id).getValue();

    if (locked) {
        this.app.editor.execute(new SetScaleCommand(this.selected, new THREE.Vector3(value, value, value)));
    } else {
        this.app.editor.execute(new SetScaleCommand(this.selected, new THREE.Vector3(x, y, z)));
    }
};

export default TransformComponent;