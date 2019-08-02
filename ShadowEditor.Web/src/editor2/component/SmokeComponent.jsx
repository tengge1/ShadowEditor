import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, NumberProperty } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';

/**
 * 烟组件
 * @author tengge / https://github.com/tengge1
 */
class SmokeComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;
        this.isPlaying = false;

        this.state = {
            show: false,
            expanded: true,
            size: 2,
            lifetime: 10,
            previewText: L_PREVIEW,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.onAnimate = this.onAnimate.bind(this);
    }

    render() {
        const { show, expanded, size, lifetime, previewText } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_SMOKE_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty label={'尺寸'} name={'size'} value={size} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'时长'} name={'lifetime'} value={lifetime} onChange={this.handleChange}></NumberProperty>
            <ButtonProperty text={previewText} onChange={this.handlePreview}></ButtonProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.SmokeComponent`, this.handleUpdate);
        app.on(`objectChanged.SmokeComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected.userData.type === 'Smoke')) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            size: this.selected.userData.size,
            lifetime: this.selected.userData.lifetime,
            previewText: this.isPlaying ? L_CANCEL : L_PREVIEW,
        });
    }

    handleChange(value, name) {
        this.setState({
            [name]: value,
        });

        if (value === null) {
            return;
        }

        const { size, lifetime } = Object.assign({}, this.state, {
            [name]: value,
        });

        this.selected.userData.size = size
        this.selected.userData.lifetime = lifetime;

        this.selected.material.uniforms.size.value = size;
        this.selected.material.uniforms.lifetime.value = lifetime;

        app.call(`objectChanged`, this, this.selected);
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

        app.on(`animate.${this.id}`, this.onAnimate);
    }

    stopPreview() {
        this.isPlaying = false;

        this.setState({
            previewText: L_PREVIEW,
        });

        app.on(`animate.${this.id}`, null);
    }

    onAnimate(clock, deltaTime) {
        const elapsed = clock.getElapsedTime();
        this.selected.update(elapsed);
    }
}

export default SmokeComponent;