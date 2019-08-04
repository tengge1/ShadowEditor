import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty, SelectProperty, ButtonsProperty, Button } from '../../../third_party';
import BoxShapeHelper from './helper/BoxShapeHelper';
import SphereShapeHelper from './helper/SphereShapeHelper';

let physicsShapeHelper = {
    btBoxShape: BoxShapeHelper,
    btSphereShape: SphereShapeHelper,
};

/**
 * 刚体组件
 * @author tengge / https://github.com/tengge1
 */
class RigidBodyComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.shape = {
            btBoxShape: L_BOX_SHAPE,
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
            btSphereShape: L_SPHERE_SHAPE,
            // btStaticPlaneShape: '静态平板',
            // btTriangleMeshShape: '三角网格'
        };

        this.state = {
            show: false,
            expanded: true,
            shape: 'btBoxShape',
            mass: 1,
            inertiaX: 0,
            inertiaY: 0,
            inertiaZ: 0,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRemoved = this.handleRemoved.bind(this);
    }

    render() {
        const { show, expanded, shape, mass, inertiaX, inertiaY, inertiaZ } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_RIGID_BODY} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <SelectProperty label={L_SHAPE} options={this.shape} name={'shape'} value={shape} onChange={this.handleChange}></SelectProperty>
            <NumberProperty label={'Mass'} name={'mass'} value={mass} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'InertiaX'} name={'inertiaX'} value={inertiaX} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'InertiaY'} name={'inertiaY'} value={inertiaY} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'InertiaZ'} name={'inertiaZ'} value={inertiaZ} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.RigidBodyComponent`, this.handleUpdate);
        app.on(`objectChanged.RigidBodyComponent`, this.handleUpdate);
        app.on(`objectRemoved.RigidBodyComponent`, this.handleRemoved);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected ||
            !editor.selected.userData.physics ||
            !editor.selected.userData.physics.enabled ||
            editor.selected.userData.physics.type !== 'rigidBody') {
            if (this.helper !== undefined) {
                app.editor.removePhysicsHelper(this.helper);
            }
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        let { shape, mass, inertia } = this.selected.userData.physics || {};

        this.setState({
            show: true,
            shape: physics.shape || 'btBoxShape',
            mass: physics.mass || 0,
            inertiaX: physics.inertia.x || 0,
            inertiaY: physics.inertia.y || 0,
            inertiaZ: physics.inertia.z || 0,
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { shape, mass, inertiaX, inertiaY, inertiaZ } = Object.assign({}, this.state, {
            [name]: value,
        });

        let physics = this.selected.userData.physics;

        physics.shape = shape;
        physics.mass = mass;
        physics.inertia.x = inertiaX;
        physics.inertia.y = inertiaY;
        physics.inertia.z = inertiaZ;

        app.call('objectChanged', this, this.selected);
    }

    handleRemoved(object) {
        if (this.helper && this.helper.object === object) {
            app.editor.removePhysicsHelper(this.helper);
        }
    }

    // -------------------------- 物理形状帮助器 -------------------------------------

    showPhysicsShapeHelper() {
        if (this.selected == null) {
            return;
        }

        if (this.helper !== undefined) {
            app.editor.removePhysicsHelper(this.helper);
        }

        let physics = this.selected.userData.physics;

        if (!physics || !physics.enabled) {
            return;
        }

        let helper = physicsShapeHelper[physics.shape];

        if (!helper) {
            console.warn(`RigidBodyComponent: ${physics.shape} ${L_HAS_NO_PHYSICS_HELPER}`);
            return;
        }

        this.helper = new helper(this.selected);
        app.editor.addPhysicsHelper(this.helper);
    }
}

export default RigidBodyComponent;