import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, SelectProperty, ButtonsProperty, Button, ColorProperty } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';

/**
 * 材质组件
 * @author tengge / https://github.com/tengge1
 */
class MaterialComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;
        this.isPlaying = false;

        this.materials = {
            'LineBasicMaterial': L_LINE_BASIC_MATERIAL,
            'LineDashedMaterial': L_LINE_DASHED_MATERIAL,
            'MeshBasicMaterial': L_MESH_BASIC_MATERIAL,
            'MeshDepthMaterial': L_MESH_DEPTH_MATERIAL,
            'MeshNormalMaterial': L_MESH_NORMAL_MATERIAL,
            'MeshLambertMaterial': L_MESH_LAMBERT_MATERIAL,
            'MeshPhongMaterial': L_MESH_PHONG_MATERIAL,
            'PointCloudMaterial': L_POINT_CLOUD_MATERIAL,
            'MeshStandardMaterial': L_MESH_STANDARD_MATERIAL,
            'MeshPhysicalMaterial': L_MESH_PHYSICAL_MATERIAL,
            'SpriteMaterial': L_SPRITE_MATERIAL,
            'ShaderMaterial': L_SHADER_MATERIAL,
            'RawShaderMaterial': L_RAW_SHADER_MATERIAL
        };

        this.state = {
            show: false,
            expanded: true,

        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.onAnimate = this.onAnimate.bind(this);
    }

    render() {
        const { show, expanded, options, animation, previewText } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_MATERIAL_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <ButtonsProperty label={''}>
                <Button onClick={this.onSave}>{L_SAVE}</Button>
                <Button onClick={this.onLoad}>{L_SELECT}</Button>
            </ButtonsProperty>
            <SelectProperty label={L_ANIMATION} options={this.materials} value={animation} onChange={this.handleChange}></SelectProperty>
            <ButtonsProperty label={''}>
                <Button onClick={this.onSave}>{L_SHADER_PROGRAM}</Button>
                <Button onClick={this.onLoad}>{L_VERTEX}</Button>
                <Button onClick={this.onLoad}>{L_FRAGMENT}</Button>
            </ButtonsProperty>
            <ColorProperty name={'color'}></ColorProperty>
            <ButtonProperty text={previewText} onChange={this.handlePreview}></ButtonProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.MaterialComponent`, this.handleUpdate);
        app.on(`objectChanged.MaterialComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected.userData.type === 'lol')) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        const model = this.selected.userData.model;
        const animNames = model.getAnimations();

        let options = {

        };

        animNames.forEach(n => {
            options[n] = n;
        });

        this.setState({
            show: true,
            options,
            animation: animNames[0],
            previewText: this.isPlaying ? L_CANCEL : L_PREVIEW,
        });
    }

    handleChange(value) {
        const model = this.selected.userData.model;

        model.setAnimation(value);

        this.setState({ animation: value });
    }

    handlePreview() {
        if (this.isPlaying) {
            this.stopPreview();
        } else {
            this.startPreview();
        }
    }

    startPreview() {
        const animation = this.state.animation;

        if (!animation) {
            app.toast(`Please select animation.`);
            return;
        }

        this.isPlaying = true;

        this.setState({
            previewText: L_CANCEL,
        });

        const model = this.selected.userData.model;
        model.setAnimation(animation);

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
        var model = this.selected.userData.model;
        model.update(clock.getElapsedTime() * 1000);
    }
}

export default MaterialComponent;