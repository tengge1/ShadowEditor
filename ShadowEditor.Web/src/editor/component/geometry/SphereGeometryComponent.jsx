import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty } from '../../../third_party';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 球体组件
 * @author tengge / https://github.com/tengge1
 */
class SphereGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            radius: 1,
            widthSegments: 16,
            heightSegments: 16,
            phiStart: 0,
            phiLength: Math.PI * 2,
            thetaStart: 0,
            thetaLength: Math.PI / 2,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_GEOMETRY_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty name={'radius'} label={L_RADIUS} value={radius} onChange={this.handleChange}></NumberProperty>
            <IntegerProperty name={'widthSegments'} label={L_WIDTH_SEGMENTS} value={widthSegments} onChange={this.handleChange}></IntegerProperty>
            <IntegerProperty name={'heightSegments'} label={L_HEIGHT_SEGMENTS} value={heightSegments} onChange={this.handleChange}></IntegerProperty>
            <NumberProperty name={'phiStart'} label={L_PHI_START} value={phiStart} onChange={this.handleChange}></NumberProperty>
            <NumberProperty name={'phiLength'} label={L_PHI_LENGTH} value={phiLength} onChange={this.handleChange}></NumberProperty>
            <NumberProperty name={'thetaStart'} label={L_THETA_START} value={thetaStart} onChange={this.handleChange}></NumberProperty>
            <NumberProperty name={'thetaLength'} label={L_THETA_LENGTH} value={thetaLength} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.SphereGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.SphereGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.SphereBufferGeometry)) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        const { radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength } = Object.assign({},
            this.selected.geometry.parameters);

        this.setState({
            show: true,
            type: this.selected.geometry.constructor.name,
            radius: radius === undefined ? 1 : radius,
            widthSegments: widthSegments === undefined ? 8 : widthSegments,
            heightSegments: heightSegments === undefined ? 6 : heightSegments,
            phiStart: phiStart === undefined ? 0 : phiStart,
            phiLength: phiLength === undefined ? Math.PI * 2 : phiLength,
            thetaStart: thetaStart === undefined ? 0 : thetaStart,
            thetaLength: thetaLength === undefined ? Math.PI : thetaLength,
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength } = Object.assign({}, this.state, {
            [name]: value,
        });

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.SphereBufferGeometry(
            radius,
            widthSegments,
            heightSegments,
            phiStart,
            phiLength,
            thetaStart,
            thetaLength,
        )));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default SphereGeometryComponent;