import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, NumberProperty } from '../../../third_party';
import SetValueCommand from '../../../command/SetValueCommand';

/**
 * 布组件
 * @author tengge / https://github.com/tengge1
 */
class ClothComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;
        this.isPlaying = false;

        this.state = {
            show: false,
            expanded: true,
            previewText: L_PREVIEW,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.onAnimate = this.onAnimate.bind(this);
    }

    render() {
        const { show, expanded, previewText } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_CLOTH_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <ButtonProperty text={previewText} onChange={this.handlePreview}></ButtonProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.ClothComponent`, this.handleUpdate);
        app.on(`objectChanged.ClothComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected.userData.type === 'Cloth')) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            previewText: this.isPlaying ? L_CANCEL : L_PREVIEW,
        });
    }

    handlePreview() {
        if (this.isPlaying) {
            this.stopPreview();
        } else {
            this.startPreview();
        }
    }

    startPreview() {
        this.isPlaying = true;

        this.setState({
            previewText: L_CANCEL,
        });

        app.on(`animate.ClothComponent`, this.onAnimate);
    }

    stopPreview() {
        this.isPlaying = false;

        this.setState({
            previewText: L_PREVIEW,
        });

        app.on(`animate.ClothComponent`, null);
    }

    onAnimate(clock, deltaTime) {
        this.selected.update();
    }
}

export default ClothComponent;