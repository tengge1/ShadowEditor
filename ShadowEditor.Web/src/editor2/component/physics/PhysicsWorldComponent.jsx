import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty, SelectProperty, ButtonsProperty, Button } from '../../../third_party';

/**
 * 物理环境组件
 * @author tengge / https://github.com/tengge1
 */
class PhysicsWorldComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.type = {
            'btDefaultCollisionConfiguration': L_DEFAULT_COLLISION_CONFIG, // 无法使用布料
            'btSoftBodyRigidBodyCollisionConfiguration': L_SOFTBODY_RIGIDBODY_COLLISIONCONFIG,
        };

        this.state = {
            show: false,
            expanded: true,
            type: 'btSoftBodyRigidBodyCollisionConfiguration',
            gravityX: 0,
            gravityY: -9.8,
            gravityZ: 0,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, type, gravityX, gravityY, gravityZ } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_PHYSICS_ENVIRONMENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <SelectProperty label={L_TYPE} options={this.type} name={'type'} value={type} onChange={this.handleChange}></SelectProperty>
            <NumberProperty label={'GravityX'} name={'gravityX'} value={gravityX} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'GravityY'} name={'gravityY'} value={gravityY} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'GravityZ'} name={'gravityZ'} value={gravityZ} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.PhysicsWorldComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.PhysicsWorldComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.scene) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        if (!this.selected.userData.physics) {
            this.selected.userData.physics = {
                type: 'btSoftBodyRigidBodyCollisionConfiguration',
                gravityX: 0.0,
                gravityY: -9.8,
                gravityZ: 0.0,
            };
        }

        let { type, gravityX, gravityY, gravityZ } = this.selected.userData.physics;

        this.setState({
            show: true,
            type,
            gravityX,
            gravityY,
            gravityZ,
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { type, gravityX, gravityY, gravityZ } = Object.assign({}, this.state, {
            [name]: value,
        });

        this.selected.userData.physics = {
            type,
            gravityX,
            gravityY,
            gravityZ,
        };

        app.call('objectChanged', this, this.selected);
    }
}

export default PhysicsWorldComponent;