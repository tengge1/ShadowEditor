import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty } from '../../third_party';
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
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChangeWidth = this.handleChangeWidth.bind(this);
        this.handleChangeHeight = this.handleChangeHeight.bind(this);
        this.handleChangeDepth = this.handleChangeDepth.bind(this);
        this.handleChangeSliceSpacing = this.handleChangeSliceSpacing.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
    }

    render() {
        const { show, expanded, fov, near, far } = this.state;

        return <PropertyGroup title={L_FIRE_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <TextProperty name={'width'} label={L_WIDTH} value={width} onChange={this.handleChangeWidth}></TextProperty>
            <TextProperty name={'height'} label={L_HEIGHT} value={height} onChange={this.handleChangeHeight}></TextProperty>
            <TextProperty name={'depth'} label={L_DEPTH} value={depth} onChange={this.handleChangeDepth}></TextProperty>
            <TextProperty name={'sliceSpacing'} label={L_SLICE_SPACING} value={sliceSpacing} onChange={this.handleChangeSliceSpacing}></TextProperty>
            <ButtonProperty text={L_PREVIEW} onChange={this.handlePreview}></ButtonProperty>
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
            fov: this.selected.fov,
            near: this.selected.near,
            far: this.selected.far,
        });
    }

    handleChangeWidth(value) {
        app.editor.execute(new SetValueCommand(this.selected, 'fov', value));
    }

    handleChangeHeight(value) {
        app.editor.execute(new SetValueCommand(this.selected, 'near', value));
    }

    handleChangeDepth(value) {
        app.editor.execute(new SetValueCommand(this.selected, 'far', value));
    }

    handlePreview() {
        app.editor.execute(new SetValueCommand(this.selected, 'far', value));
    }
}

export default FireComponent;