import BaseComponent from '../BaseComponent';

/**
 * 基本信息组件
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
                id: 'configType',
                scope: this.id,
                options: {
                    'btDefaultCollisionConfiguration': '默认碰撞配置', // 无法使用布料
                    'btSoftBodyRigidBodyCollisionConfiguration': '软体刚体碰撞配置'
                },
                onChange: this.onChangeConfigType.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '重力常数'
            }, {
                xtype: 'number',
                id: 'gravityConstantX',
                scope: this.id,
                onChange: this.onChangeGravityConstant.bind(this)
            }, {
                xtype: 'number',
                id: 'gravityConstantY',
                scope: this.id,
                onChange: this.onChangeGravityConstant.bind(this)
            }, {
                xtype: 'number',
                id: 'gravityConstantZ',
                scope: this.id,
                onChange: this.onChangeGravityConstant.bind(this)
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

    this.selected = app.physics;

    var configType = UI.get('configType', this.id);
    var gravityConstantX = UI.get('gravityConstantX', this.id);
    var gravityConstantY = UI.get('gravityConstantY', this.id);
    var gravityConstantZ = UI.get('gravityConstantZ', this.id);

    if (this.selected.collisionConfiguration instanceof Ammo.btSoftBodyRigidBodyCollisionConfiguration) {
        configType.setValue('btSoftBodyRigidBodyCollisionConfiguration');
    } else {
        configType.setValue('btDefaultCollisionConfiguration');
    }

    var gravity = this.selected.world.getGravity();
    gravityConstantX.setValue(gravity.x());
    gravityConstantY.setValue(gravity.y());
    gravityConstantZ.setValue(gravity.z());
};

PhysicsWorldComponent.prototype.onChangeConfigType = function () {
    var configType = UI.get('configType', this.id);
    if (configType === 'btSoftBodyRigidBodyCollisionConfiguration') {
        this.selected.collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
    } else {
        this.selected.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    }
    this.selected.dispatcher = new Ammo.btCollisionDispatcher(this.selected.collisionConfiguration);
    this.selected.world.dispatcher = this.selected.dispatcher;
};

PhysicsWorldComponent.prototype.onChangeGravityConstant = function () {
    var gravityConstantX = UI.get('gravityConstantX', this.id);
    var gravityConstantY = UI.get('gravityConstantY', this.id);
    var gravityConstantZ = UI.get('gravityConstantZ', this.id);

    var gravity = new Ammo.btVector3(gravityConstantX.getValue(), gravityConstantY.getValue(), gravityConstantZ.getValue());
    this.selected.world.setGravity(gravity);
    this.selected.world.getWorldInfo().set_m_gravity(gravity);
};

export default PhysicsWorldComponent;