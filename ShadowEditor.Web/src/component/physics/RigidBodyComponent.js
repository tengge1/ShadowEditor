import BaseComponent from '../BaseComponent';
import BoxShapeHelper from './helper/BoxShapeHelper';
import SphereShapeHelper from './helper/SphereShapeHelper';

var physicsShapeHelper = {
    btBoxShape: BoxShapeHelper,
    btSphereShape: SphereShapeHelper,
};

/**
 * 刚体组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function RigidBodyComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

RigidBodyComponent.prototype = Object.create(BaseComponent.prototype);
RigidBodyComponent.prototype.constructor = RigidBodyComponent;

RigidBodyComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'rigidBodyPanel',
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
                    width: '100%',
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '刚体'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '启用'
            }, {
                xtype: 'checkbox',
                id: 'enabled',
                scope: this.id,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '形状'
            }, {
                xtype: 'select',
                id: 'shape',
                scope: this.id,
                options: {
                    btBoxShape: '正方体',
                    // btBvhTriangleMeshShape: 'bvh三角形网格',
                    // btCapsuleShape: '胶囊',
                    // btCapsuleShapeX: 'x轴胶囊',
                    // btCapsuleShapeZ: 'z轴胶囊',
                    // btCollisionShape: '碰撞体',
                    // btCompoundShape: '复合形状',
                    // btConcaveShape: '凹面体',
                    // btConeShape: '圆锥体',
                    // btConeShapeX: 'x轴圆椎体',
                    // btConeShapeZ: 'z轴圆椎体',
                    // btConvexHullShape: '凸包',
                    // btConvexShape: '凸面体',
                    // btConvexTriangleMeshShape: '凸三角形网格',
                    // btCylinderShape: '圆柱体',
                    // btCylinderShapeX: 'x轴圆柱体',
                    // btCylinderShapeZ: 'z轴圆柱体',
                    // btHeightfieldTerrainShape: '灰阶高程地形',
                    btSphereShape: '球体',
                    // btStaticPlaneShape: '静态平板',
                    // btTriangleMeshShape: '三角网格'
                },
                style: {
                    width: '130px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '质量'
            }, {
                xtype: 'number',
                id: 'mass',
                scope: this.id,
                style: {
                    width: '100px',
                    fontSize: '12px'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '惯性'
            }, {
                xtype: 'number',
                id: 'inertiaX',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'inertiaY',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }, {
                xtype: 'number',
                id: 'inertiaZ',
                scope: this.id,
                style: {
                    width: '40px'
                },
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

RigidBodyComponent.prototype.onObjectSelected = function () {
    this.updateUI();
    this.showPhysicsShapeHelper();
};

RigidBodyComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

RigidBodyComponent.prototype.updateUI = function () {
    var container = UI.get('rigidBodyPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Mesh && editor.selected.userData.physics) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var enabled = UI.get('enabled', this.id);
    var shape = UI.get('shape', this.id);
    var mass = UI.get('mass', this.id);
    var inertiaX = UI.get('inertiaX', this.id);
    var inertiaY = UI.get('inertiaY', this.id);
    var inertiaZ = UI.get('inertiaZ', this.id);

    var physics = this.selected.userData.physics;

    enabled.setValue(physics.enabled);
    shape.setValue(physics.shape);
    mass.setValue(physics.mass);
    inertiaX.setValue(physics.inertia.x);
    inertiaY.setValue(physics.inertia.y);
    inertiaZ.setValue(physics.inertia.z);
};

RigidBodyComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);
    var shape = UI.get('shape', this.id);
    var mass = UI.get('mass', this.id);
    var inertiaX = UI.get('inertiaX', this.id);
    var inertiaY = UI.get('inertiaY', this.id);
    var inertiaZ = UI.get('inertiaZ', this.id);

    var physics = this.selected.userData.physics;

    physics.enabled = enabled.getValue();
    physics.shape = shape.getValue();
    physics.mass = mass.getValue();
    physics.inertia.x = inertiaX.getValue();
    physics.inertia.y = inertiaY.getValue();
    physics.inertia.z = inertiaZ.getValue();
};

// -------------------------- 物理形状帮助器 -------------------------------------

RigidBodyComponent.prototype.showPhysicsShapeHelper = function () {
    if (this.selected == null) {
        return;
    }

    if (this.helper !== undefined) {
        this.app.editor.removePhysicsHelper(this.helper);
    }

    var physics = this.selected.userData.physics;
    if (!physics) {
        return;
    }

    var helper = physicsShapeHelper[physics.shape];

    if (!helper) {
        console.warn(`RigidBodyComponent: ${physics.shape}暂无对应物理形状帮助器。`);
        return;
    }

    this.helper = new helper(this.selected);
    this.app.editor.addPhysicsHelper(this.helper);
};

export default RigidBodyComponent;