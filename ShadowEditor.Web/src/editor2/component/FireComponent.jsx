import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, NumberProperty } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';

/**
 * 火焰组件
 * @author tengge / https://github.com/tengge1
 */
class FireComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;
        this.isPlaying = false;

        this.state = {
            show: false,
            expanded: true,
            width: 2,
            height: 4,
            depth: 2,
            sliceSpacing: 2,
            previewText: L_PREVIEW,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
    }

    render() {
        const { show, expanded, width, height, depth, sliceSpacing, previewText } = this.state;

        return <PropertyGroup title={L_FIRE_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty label={L_WIDTH} value={width} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_HEIGHT} value={height} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_DEPTH} value={depth} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_SLICE_SPACING} value={sliceSpacing} onChange={this.handleChange}></NumberProperty>
            <ButtonProperty text={previewText} onChange={this.handlePreview}></ButtonProperty>
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

        if (!editor.selected || !(editor.selected.userData.type === 'Fire')) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            width: this.selected.userData.width,
            height: this.selected.userData.height,
            depth: this.selected.userData.depth,
            sliceSpacing: this.selected.userData.sliceSpacing,
            previewText: this.isPlaying ? L_CANCEL : L_PREVIEW,
        });
    }

    handleChange(value, name) {

    }

    handlePreview() {

    }
}

export default FireComponent;