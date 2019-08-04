import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty, SelectProperty, ButtonsProperty, Button } from '../../../third_party';

/**
 * 柔软体组件
 * @author tengge / https://github.com/tengge1
 */
class SoftVolumeComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            mass: 1,
            pressure: 1,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, mass, pressure } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_SOFT_VOLUME} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty label={'Mass'} name={'mass'} value={mass} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_PRESSURE} name={'pressure'} value={pressure} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.SoftVolumeComponent`, this.handleUpdate);
        app.on(`objectChanged.SoftVolumeComponent`, this.handleUpdate);
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
            editor.selected.userData.physics.type !== 'softVolume') {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        let { mass, pressure } = this.selected.userData.physics || {};

        this.setState({
            show: true,
            mass: mass || 0,
            pressure: pressure || 0,
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { mass, pressure } = Object.assign({}, this.state, {
            [name]: value,
        });

        let physics = this.selected.userData.physics;

        physics.mass = mass;
        physics.pressure = pressure;

        app.call('objectChanged', this, this.selected);
    }
}

export default SoftVolumeComponent;