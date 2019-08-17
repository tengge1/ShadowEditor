import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';

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

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Camera Component')} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty label={_t('Fov')} name={'fov'} value={fov} onChange={this.handleChangeFov}></NumberProperty>
            <NumberProperty label={_t('Near')} name={'near'} value={near} onChange={this.handleChangeNear}></NumberProperty>
            <NumberProperty label={_t('Far')} name={'far'} value={far} onChange={this.handleChangeFar}></NumberProperty>
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

        // TODO: 应判断是否等于默认相机
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
        if (value === null) {
            this.setState({
                fov: value,
            });
            return;
        }

        app.editor.execute(new SetValueCommand(this.selected, 'fov', value));
    }

    handleChangeNear(value) {
        if (value === null) {
            this.setState({
                near: value,
            });
            return;
        }

        app.editor.execute(new SetValueCommand(this.selected, 'near', value));
    }

    handleChangeFar(value) {
        if (value === null) {
            this.setState({
                far: value,
            });
            return;
        }

        app.editor.execute(new SetValueCommand(this.selected, 'far', value));
    }
}

export default CameraComponent;