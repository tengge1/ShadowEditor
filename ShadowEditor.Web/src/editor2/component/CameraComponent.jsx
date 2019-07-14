import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';
import Text from '../../object/geometry/Text';

/**
 * 相机组件
 * @author tengge / https://github.com/tengge1
 */
class CameraComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            expanded: true,
            fov: 70,
            near: 0.1,
            far: 1000,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChangeFov = this.handleChangeFov.bind(this);
        this.handleChangeNear = this.handleChangeNear.bind(this);
        this.handleChangeFar = this.handleChangeFar.bind(this);
    }

    render() {
        const { show, expanded, fov, near, far } = this.state;

        return <PropertyGroup title={L_CAMERA_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <TextProperty name={'fov'} label={L_FOV} value={fov} onChange={this.handleChangeFov}></TextProperty>
            <TextProperty name={'near'} label={L_NEAR} value={near} onChange={this.handleChangeNear}></TextProperty>
            <TextProperty name={'far'} label={L_FAR} value={far} onChange={this.handleChangeFar}></TextProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.CameraComponent`, this.handleUpdate);
        app.on(`objectChanged.CameraComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.PerspectiveCamera)) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            fov: this.selected.fov,
            near: this.selected.near,
            far: this.selected.far,
        });
    }

    handleChangeFov(value) {
        app.editor.execute(new SetValueCommand(this.selected, 'fov', value));
    }

    handleChangeNear(value) {
        app.editor.execute(new SetValueCommand(this.selected, 'near', value));
    }

    handleChangeFar(value) {
        app.editor.execute(new SetValueCommand(this.selected, 'far', value));
    }
}

export default CameraComponent;