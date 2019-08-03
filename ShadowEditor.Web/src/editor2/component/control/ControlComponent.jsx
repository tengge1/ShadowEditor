import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty, SelectProperty } from '../../../third_party';

/**
 * 音频监听器组件
 * @author tengge / https://github.com/tengge1
 */
class ControlComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.type = {
            '': L_NONE,
            'FirstPersonControls': L_FIRST_PERSON_CONTROLS,
            'FlyControls': L_FLY_CONTROLS,
            'OrbitControls': L_ORBIT_CONTROLS,
            'PointerLockControls': L_POINTER_LOCK_CONTROLS,
            'TrackballControls': L_TRACEBALL_CONTROLS,
        };

        this.state = {
            show: false,
            expanded: true,
            type: '',
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, type } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_SCENE_CONTROLLER} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <SelectProperty label={L_TYPE} options={this.type} name={'type'} value={type} onChange={this.handleChange}></SelectProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.ControlComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.ControlComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.camera) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            type: this.selected.userData.control || '',
        });
    }

    handleChange(value, name) {
        const { type } = Object.assign({}, this.state, {
            [name]: value,
        });

        this.selected.userData.control = type;

        app.call('objectChanged', this, this.selected);
    }
}

export default ControlComponent;