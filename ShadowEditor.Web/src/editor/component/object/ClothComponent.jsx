import { PropertyGroup, ButtonProperty } from '../../../third_party';

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
            previewText: _t('Preview')
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

        return <PropertyGroup title={_t('ClothComponent')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <ButtonProperty text={previewText}
                onChange={this.handlePreview}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.ClothComponent`, this.handleUpdate);
        app.on(`objectChanged.ClothComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected.userData.type === 'Cloth')) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            previewText: this.isPlaying ? _t('Cancel') : _t('Preview')
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
            previewText: _t('Cancel')
        });

        app.on(`animate.ClothComponent`, this.onAnimate);
    }

    stopPreview() {
        this.isPlaying = false;

        this.setState({
            previewText: _t('Preview')
        });

        app.on(`animate.ClothComponent`, null);
    }

    onAnimate() {
        this.selected.update();
    }
}

export default ClothComponent;