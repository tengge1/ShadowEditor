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

        const { radius, tube, tubularSegments, radialSegments, p, q } = Object.assign({}, this.selected.geometry.parameters, {
            show: true,
        });

        this.setState({
            radius: radius === undefined ? 1 : radius,
            tube: tube === undefined ? 0.4 : tube,
            tubularSegments: tubularSegments === undefined ? 64 : tubularSegments,
            radialSegments: radialSegments === undefined ? 8 : radialSegments,
            p: p === undefined ? 2 : p,
            q: q === undefined ? 3 : q,
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { radius, tube, tubularSegments, radialSegments, p, q } = Object.assign({}, this.state, {
            [name]: value,
        });

        this.setState(state);

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.TorusKnotBufferGeometry(
            radius,
            tube,
            tubularSegments,
            radialSegments,
            p,
            q,
        )));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default TorusKnotGeometryComponent;