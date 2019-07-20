import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, NumberProperty } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';

/**
 * 阴影组件
 * @author tengge / https://github.com/tengge1
 */
class ShadowComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.mapSize = {
            512: '512*512',
            1024: '1024*1024',
            2048: '2048*2048',
            4096: '4096*4096',
        };

        this.state = {
            show: false,
            expanded: true,
            castShadow: false,
            receiveShadow: false,
            shadowRadius: 1,
            mapSize: 512,
            bias: 0,
            cameraLeft: -5,
            cameraRight: 5,
            cameraTop: 5,
            cameraBottom: -5,
            cameraNear: 0.5,
            cameraFar: 1000,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, castShadow, receiveShadow, shadowRadius, mapSize, bias,
            cameraLeft, cameraRight, cameraTop, cameraBottom, cameraNear, cameraFar } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_SHADOW_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <CheckBoxProperty label={L_CAST} name={'castShadow'} value={castShadow} onChange={this.handleChange}></CheckBoxProperty>
            <CheckBoxProperty label={L_RECEIVE} name={'receiveShadow'} value={receiveShadow} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_RADIUS} name={'shadowRadius'} value={shadowRadius} onChange={this.handleChange}></NumberProperty>
            <SelectProperty label={L_MAP_SIZE} options={this.mapSize} name={'mapSize'} value={mapSize} onChange={this.handleChange}></SelectProperty>
            <NumberProperty label={L_BIAS} name={'bias'} value={bias} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CAMERA_LEFT} name={'cameraLeft'} value={cameraLeft} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CAMERA_RIGHT} name={'cameraRight'} value={cameraRight} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CAMERA_TOP} name={'cameraTop'} value={cameraTop} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CAMERA_BOTTOM} name={'cameraBottom'} value={cameraBottom} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CAMERA_NEAR} name={'cameraNear'} value={cameraNear} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CAMERA_FAR} name={'cameraFar'} value={cameraFar} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.ShadowComponent`, this.handleUpdate);
        app.on(`objectChanged.ShadowComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh || editor.selected instanceof THREE.DirectionalLight || editor.selected instanceof THREE.PointLight || editor.selected instanceof THREE.SpotLight)) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        if (this.selected instanceof THREE.Light) {

        } else {

        }
    }

    handleChange(value, name) {
        const state = Object.assign({}, this.state, {
            [name]: value,
        });

        const { size, lifetime } = state;

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
        let elapsed = clock.getElapsedTime();
        this.selected.update(elapsed);
    }
}

export default ShadowComponent;