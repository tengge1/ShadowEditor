import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty, SelectProperty } from '../../../third_party';

/**
 * 音频监听器组件
 * @author tengge / https://github.com/tengge1
 */
class FlyControlComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            movementSpeed: 10.0,
            rollSpeed: 0.05,
            dragToLook: false,
            autoForward: false,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, movementSpeed, rollSpeed, dragToLook, autoForward } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_FLY_CONTROLS} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty label={L_MOVEMENT_SPEED} name={'movementSpeed'} value={movementSpeed} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_ROTATE_SPEED} name={'rollSpeed'} value={rollSpeed} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_DRAG_TO_LOOK} name={'dragToLook'} value={dragToLook} onChange={this.handleChange}></CheckBoxProperty>
            <CheckBoxProperty label={L_AUTO_FORWARD} name={'autoForward'} value={autoForward} onChange={this.handleChange}></CheckBoxProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.FlyControlComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.FlyControlComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.camera || editor.selected.userData.control !== 'FlyControls') {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        if (this.selected.userData.flyOptions === undefined) {
            this.selected.userData.flyOptions = {
                movementSpeed: 20.0,
                rollSpeed: 0.2,
                dragToLook: false,
                autoForward: false,
            };
        }

        this.setState({
            show: true,
            ...this.selected.userData.flyOptions,
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { movementSpeed, rollSpeed, dragToLook, autoForward } = Object.assign({}, this.state, {
            [name]: value,
        });

        Object.assign(this.selected.userData.flyOptions, {
            movementSpeed, rollSpeed, dragToLook, autoForward
        });

        app.call('objectChanged', this, this.selected);
    }
}

export default FlyControlComponent;