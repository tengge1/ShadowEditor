import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty } from '../../../third_party';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 正方体组件
 * @author tengge / https://github.com/tengge1
 */
class BoxGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            type: '',
            width: 1,
            height: 1,
            depth: 1,
            widthSegments: 1,
            heightSegments: 1,
            depthSegments: 1,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, type, width, height, depth, widthSegments, heightSegments, depthSegments } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_GEOMETRY_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <DisplayProperty label={L_TYPE} value={type}></DisplayProperty>
            <NumberProperty name={'width'} label={L_WIDTH} value={width} onChange={this.handleChange}></NumberProperty>
            <NumberProperty name={'height'} label={L_HEIGHT} value={height} onChange={this.handleChange}></NumberProperty>
            <NumberProperty name={'depth'} label={L_DEPTH} value={depth} onChange={this.handleChange}></NumberProperty>
            <IntegerProperty name={'widthSegments'} label={L_WIDTH_SEGMENTS} value={widthSegments} onChange={this.handleChange}></IntegerProperty>
            <IntegerProperty name={'heightSegments'} label={L_HEIGHT_SEGMENTS} value={heightSegments} onChange={this.handleChange}></IntegerProperty>
            <IntegerProperty name={'depthSegments'} label={L_DEPTH_SEGMENTS} value={depthSegments} onChange={this.handleChange}></IntegerProperty>
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

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.BoxBufferGeometry)) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        const { width, height, depth, widthSegments, heightSegments, depthSegments } = Object.assign({},
            this.selected.geometry.parameters, {
                type: this.selected.geometry.constructor.name,
                show: true,
            });

        this.setState({
            show: true,
            type: this.selected.geometry.constructor.name,
            width: width === undefined ? 1 : width,
            height: height === undefined ? 1 : height,
            depth: depth === undefined ? 1 : depth,
            widthSegments: widthSegments === undefined ? 1 : widthSegments,
            heightSegments: heightSegments === undefined ? 1 : heightSegments,
            depthSegments: depthSegments === undefined ? 1 : depthSegments,
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { width, height, depth, widthSegments, heightSegments, depthSegments } = Object.assign({}, this.state, {
            [name]: value,
        });

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.BoxBufferGeometry(
            width,
            height,
            depth,
            widthSegments,
            heightSegments,
            depthSegments,
        )));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default BoxGeometryComponent;