import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty } from '../../../third_party';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * BufferGeometry组件
 * @author tengge / https://github.com/tengge1
 */
class BufferGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            positionCount: 0,
            normalCount: 0,
            uvCount: 0,
            indexCound: 0,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    render() {
        const { show, expanded, positionCount, normalCount, uvCount, indexCound } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('BufferGeometry Component')} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <DisplayProperty label={_t('Position Count')} value={positionCount}></DisplayProperty>
            <DisplayProperty label={_t('Normal Count')} value={normalCount}></DisplayProperty>
            <DisplayProperty label={_t('UV Count')} value={uvCount}></DisplayProperty>
            <DisplayProperty label={_t('Index Count')} value={indexCound}></DisplayProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.BufferGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.BufferGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.BufferGeometry)) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        const geometry = this.selected.geometry;

        this.setState({
            show: true,
            positionCount: geometry.attributes.position ? geometry.attributes.position.count : 0,
            normalCount: geometry.attributes.normal ? geometry.attributes.normal.count : 0,
            uvCount: geometry.attributes.uv ? geometry.attributes.uv.count : 0,
            indexCound: geometry.index ? geometry.index.count : 0
        });
    }
}

export default BufferGeometryComponent;