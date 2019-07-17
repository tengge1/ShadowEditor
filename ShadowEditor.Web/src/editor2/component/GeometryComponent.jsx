import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';

/**
 * 几何体组件
 * @author tengge / https://github.com/tengge1
 */
class GeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            expanded: true,
            name: '',
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    render() {
        const { show, expanded, name } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_GEOMETRY_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <DisplayProperty label={L_TYPE} value={name}></DisplayProperty>
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

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh)) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        let name = this.selected.geometry.constructor.name;

        if (this.selected.geometry instanceof THREE.TeapotBufferGeometry) {
            name = 'TeapotBufferGeometry';
        }

        this.setState({
            show: true,
            name,
        });
    }
}

export default GeometryComponent;