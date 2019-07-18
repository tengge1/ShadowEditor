import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty } from '../../../third_party';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 二十面体组件
 * @author tengge / https://github.com/tengge1
 */
class LatheGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            segments: 16,
            phiStart: 0.0,
            phiLength: Math.PI * 2,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, segments, phiStart, phiLength } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_GEOMETRY_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <IntegerProperty name={'segments'} label={L_RADIAL_SEGMENTS} value={segments} onChange={this.handleChange}></IntegerProperty>
            <NumberProperty name={'phiStart'} label={L_PHI_START} value={phiStart} onChange={this.handleChange}></NumberProperty>
            <NumberProperty name={'phiLength'} label={L_PHI_LENGTH} value={phiLength} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.BoxGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.BoxGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.LatheBufferGeometry)) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        const state = Object.assign({}, this.selected.geometry.parameters, {
            show: true,
        });

        this.setState(state);
    }

    handleChange(value, name, event) {
        const state = Object.assign({}, this.state, {
            [name]: value,
        });

        this.setState(state);

        const points = this.selected.geometry.parameters.points;

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.LatheBufferGeometry(
            points,
            state.segments,
            state.phiStart,
            state.phiLength,
        )));
    }
}

export default LatheGeometryComponent;