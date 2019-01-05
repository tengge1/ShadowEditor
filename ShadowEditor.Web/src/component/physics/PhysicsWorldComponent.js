import BaseComponent from '../BaseComponent';

/**
 * 物理环境组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function PhysicsWorldComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

PhysicsWorldComponent.prototype = Object.create(BaseComponent.prototype);
PhysicsWorldComponent.prototype.constructor = PhysicsWorldComponent;

PhysicsWorldComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'objectPanel',
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
                text: '物理环境'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '碰撞配置'
            }, {
                xtype: 'select',
                id: 'type',
                scope: this.id,
                options: {
                    'btDefaultCollisionConfiguration': '默认碰撞配置', // 无法使用布料
                    'btSoftBodyRigidBodyCollisionConfiguration': '软体刚体碰撞配置'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '重力常数'
            }, {
                xtype: 'number',
                id: 'gravityX',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'gravityY',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'gravityZ',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

PhysicsWorldComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

PhysicsWorldComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

PhysicsWorldComponent.prototype.updateUI = function () {
    var container = UI.get('objectPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Scene) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var type = UI.get('type', this.id);
    var gravityX = UI.get('gravityX', this.id);
    var gravityY = UI.get('gravityY', this.id);
    var gravityZ = UI.get('gravityZ', this.id);

    var physics = this.selected.userData.physics || {
        type: 'btSoftBodyRigidBodyCollisionConfiguration',
        gravityX: 0.0,
        gravityY: -9.8,
        gravityZ: 0.0
    };

    if (physics.type) {
        type.setValue(physics.type);
    }

    if (physics.gravityX) {
        gravityX.setValue(physics.gravityX);
    }

    if (physics.gravityY) {
        gravityY.setValue(physics.gravityY);
    }

    if (physics.gravityZ) {
        gravityZ.setValue(physics.gravityZ);
    }
};

PhysicsWorldComponent.prototype.onChange = function () {
    var type = UI.get('type', this.id);
    var gravityX = UI.get('gravityX', this.id);
    var gravityY = UI.get('gravityY', this.id);
    var gravityZ = UI.get('gravityZ', this.id);

    this.selected.userData.physics = {
        type: type.getValue(),
        gravityX: gravityX.getValue(),
        gravityY: gravityY.getValue(),
        gravityZ: gravityZ.getValue(),
    };
};

export default PhysicsWorldComponent;