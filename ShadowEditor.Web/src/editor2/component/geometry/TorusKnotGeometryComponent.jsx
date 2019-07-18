import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty } from '../../../third_party';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 环面纽结组件
 * @author tengge / https://github.com/tengge1
 */
class TorusKnotGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            radius: 1,
            tube: 1,
            tubularSegments: 16,
            radialSegments: 16,
            p: 20,
            q: 20,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, radius, tube, tubularSegments, radialSegments, p, q } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_GEOMETRY_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty name={'radius'} label={L_RADIUS} value={radius} onChange={this.handleChange}></NumberProperty>
            <NumberProperty name={'tube'} label={L_TUBE} value={tube} onChange={this.handleChange}></NumberProperty>
            <IntegerProperty name={'tubularSegments'} label={L_TUBULAR_SEGMENTS} value={tubularSegments} onChange={this.handleChange}></IntegerProperty>
            <IntegerProperty name={'radialSegments'} label={L_RADIAL_SEGMENTS} value={radialSegments} onChange={this.handleChange}></IntegerProperty>
            <NumberProperty name={'p'} label={L_TUBE_ARC} value={p} onChange={this.handleChange}></NumberProperty>
            <NumberProperty name={'q'} label={L_DISTORTED_ARC} value={q} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.TorusKnotGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.TorusKnotGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.TorusKnotBufferGeometry)) {
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

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.TorusKnotBufferGeometry(
            state.radius,
            state.tube,
            state.tubularSegments,
            state.radialSegments,
            state.p,
            state.q,
        )));
    }
}

export default TorusKnotGeometryComponent;