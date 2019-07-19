import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, SelectProperty } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';
import SetPositionCommand from '../../command/SetPositionCommand';
import SetRotationCommand from '../../command/SetRotationCommand';
import SetScaleCommand from '../../command/SetScaleCommand';

/**
 * 位移组件
 * @author tengge / https://github.com/tengge1
 */
class TransformComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            positionX: 0.0,
            positionY: 0.0,
            positionZ: 0.0,
            rotationX: 0.0,
            rotationY: 0.0,
            rotationZ: 0.0,
            scaleX: 1.0,
            scaleY: 1.0,
            scaleZ: 1.0,
            scaleLocked: true,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChangePosition = this.handleChangePosition.bind(this);
        this.handleChangeRotation = this.handleChangeRotation.bind(this);
        this.handleChangeScale = this.handleChangeScale.bind(this);
        this.handleChangeScaleLock = this.handleChangeScaleLock.bind(this);
    }

    render() {
        const { show, expanded, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, scaleX, scaleY, scaleZ, scaleLocked } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_TRANSFORM_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty name={'positionX'} label={L_TRANSLATE} value={positionX} onChange={this.handleChangePosition}></NumberProperty>
            <NumberProperty name={'positionY'} label={L_TRANSLATE} value={positionY} onChange={this.handleChangePosition}></NumberProperty>
            <NumberProperty name={'positionZ'} label={L_TRANSLATE} value={positionZ} onChange={this.handleChangePosition}></NumberProperty>
            <NumberProperty name={'rotationX'} label={L_ROTATE} value={rotationX} onChange={this.handleChangeRotation}></NumberProperty>
            <NumberProperty name={'rotationY'} label={L_ROTATE} value={rotationY} onChange={this.handleChangeRotation}></NumberProperty>
            <NumberProperty name={'rotationZ'} label={L_ROTATE} value={rotationZ} onChange={this.handleChangeRotation}></NumberProperty>
            <NumberProperty name={'scaleX'} label={L_SCALE} value={scaleX} onChange={this.handleChangeScale}></NumberProperty>
            <NumberProperty name={'scaleY'} label={L_SCALE} value={scaleY} onChange={this.handleChangeScale}></NumberProperty>
            <NumberProperty name={'scaleZ'} label={L_SCALE} value={scaleZ} onChange={this.handleChangeScale}></NumberProperty>
            <CheckBoxProperty name={'scaleLocked'} label={'Scale Locked'} value={scaleLocked} onChange={this.handleChangeScaleLock}></CheckBoxProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.TransformComponent`, this.handleUpdate);
        app.on(`objectChanged.TransformComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected.isGlobe) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            positionX: this.selected.position.x,
            positionY: this.selected.position.y,
            positionZ: this.selected.position.z,
            rotationX: this.selected.rotation.x * 180 / Math.PI,
            rotationY: this.selected.rotation.y * 180 / Math.PI,
            rotationZ: this.selected.rotation.z * 180 / Math.PI,
            scaleX: this.selected.scale.x,
            scaleY: this.selected.scale.y,
            scaleZ: this.selected.scale.z,
        });
    }


    handleChangePosition(value, name) {
        let state = Object.assign({}, this.state, {
            [name]: value,
        });

        const { positionX, positionY, positionZ } = state;

        app.editor.execute(new SetPositionCommand(this.selected, new THREE.Vector3(
            positionX,
            positionY,
            positionZ
        )));
    }

    handleChangeRotation(value, name) {
        let state = Object.assign({}, this.state, {
            [name]: value,
        });

        const { rotationX, rotationY, rotationZ } = state;

        app.editor.execute(new SetRotationCommand(this.selected, new THREE.Euler(
            rotationX * Math.PI / 180,
            rotationY * Math.PI / 180,
            rotationZ * Math.PI / 180
        )));
    }

    handleChangeScale(value, name) {
        let state = Object.assign({}, this.state, {
            [name]: value,
        });

        const { scaleX, scaleY, scaleZ, scaleLocked } = state;

        if (scaleLocked) {
            app.editor.execute(new SetScaleCommand(this.selected, new THREE.Vector3(value, value, value)));
        } else {
            app.editor.execute(new SetScaleCommand(this.selected, new THREE.Vector3(scaleX, scaleY, scaleZ)));
        }
    }

    handleChangeScaleLock(value, name) {
        this.setState({
            scaleLocked: value,
        });
    }
}

export default TransformComponent;