import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty } from '../../../third_party';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 茶壶组件
 * @author tengge / https://github.com/tengge1
 */
class TeapotGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            size: 3,
            segments: 10,
            bottom: true,
            lid: true,
            body: true,
            fitLid: true,
            blinn: true,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, size, segments, bottom, lid, body, fitLid, blinn } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_GEOMETRY_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty name={'size'} label={L_SIZE} value={size} onChange={this.handleChange}></NumberProperty>
            <IntegerProperty name={'segments'} label={L_SEGMENTS} value={segments} onChange={this.handleChange}></IntegerProperty>
            <CheckBoxProperty name={'bottom'} label={L_BOTTOM} value={bottom} onChange={this.handleChange}></CheckBoxProperty>
            <CheckBoxProperty name={'lid'} label={L_LID} value={lid} onChange={this.handleChange}></CheckBoxProperty>
            <CheckBoxProperty name={'body'} label={L_BODY} value={body} onChange={this.handleChange}></CheckBoxProperty>
            <CheckBoxProperty name={'fitLid'} label={L_FIT_LID} value={fitLid} onChange={this.handleChange}></CheckBoxProperty>
            <CheckBoxProperty name={'blinn'} label={L_BLINN} value={blinn} onChange={this.handleChange}></CheckBoxProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.TeapotGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.TeapotGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.TeapotBufferGeometry)) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        const { size, segments, bottom, lid, body, fitLid, blinn } = Object.assign({}, this.selected.geometry.parameters, {
            show: true,
        });

        this.setState({
            size: size === undefined ? 50 : size,
            segments: segments === undefined ? 10 : segments,
            bottom: bottom === undefined ? true : bottom,
            lid: lid === undefined ? true : lid,
            body: body === undefined ? true : body,
            fitLid: fitLid === undefined ? true : fitLid,
            blinn: blinn === undefined ? true : blinn,
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { size, segments, bottom, lid, body, fitLid, blinn } = Object.assign({}, this.state, {
            [name]: value,
        });

        let geometry = new THREE.TeapotBufferGeometry(size, segments, bottom, lid, body, fitLid, blinn);

        geometry.type = 'TeapotBufferGeometry';

        geometry.parameters = { size, segments, bottom, lid, body, fitLid, blinn };

        app.editor.execute(new SetGeometryCommand(this.selected, geometry));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default TeapotGeometryComponent;