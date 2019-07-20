import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, NumberProperty, SelectProperty } from '../../third_party';
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
            castShadowShow: false,

            receiveShadow: false,
            receiveShadowShow: false,

            shadowRadius: 1,
            shadowRadiusShow: false,

            mapSize: 512,
            mapSizeShow: false,

            bias: 0,
            biasShow: false,

            cameraLeft: -5,
            cameraRight: 5,
            cameraTop: 5,
            cameraBottom: -5,
            cameraNear: 0.5,
            cameraFar: 1000,
            cameraShow: false,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, castShadow, castShadowShow, receiveShadow, receiveShadowShow, shadowRadius, shadowRadiusShow, mapSize, mapSizeShow, bias, biasShow,
            cameraLeft, cameraRight, cameraTop, cameraBottom, cameraNear, cameraFar, cameraShow } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_SHADOW_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <CheckBoxProperty label={L_CAST} name={'castShadow'} value={castShadow} show={castShadowShow} onChange={this.handleChange}></CheckBoxProperty>
            <CheckBoxProperty label={L_RECEIVE} name={'receiveShadow'} value={receiveShadow} show={receiveShadow} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_RADIUS} name={'shadowRadius'} value={shadowRadius} show={shadowRadiusShow} onChange={this.handleChange}></NumberProperty>
            <SelectProperty label={L_MAP_SIZE} options={this.mapSize} name={'mapSize'} value={mapSize} show={mapSizeShow} onChange={this.handleChange}></SelectProperty>
            <NumberProperty label={L_BIAS} name={'bias'} value={bias} show={biasShow} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CAMERA_LEFT} name={'cameraLeft'} value={cameraLeft} show={cameraShow} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CAMERA_RIGHT} name={'cameraRight'} value={cameraRight} show={cameraShow} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CAMERA_TOP} name={'cameraTop'} value={cameraTop} show={cameraShow} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CAMERA_BOTTOM} name={'cameraBottom'} value={cameraBottom} show={cameraShow} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CAMERA_NEAR} name={'cameraNear'} value={cameraNear} show={cameraShow} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_CAMERA_FAR} name={'cameraFar'} value={cameraFar} show={cameraShow} onChange={this.handleChange}></NumberProperty>
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

        let state = {
            show: true,
            castShadow: this.selected.castShadow,
            castShadowShow: true,
        };

        if (this.selected instanceof THREE.Light) {
            Object.assign(state, {
                receiveShadowShow: false,
                shadowRadius: this.selected.shadow.radius,
                shadowRadiusShow: true,
                mapSize: this.selected.shadow.mapSize,
                mapSizeShow: true,
                bias: this.selected.shadow.bias,
                biasShow: true,
                cameraLeft: this.selected.shadow.camera.left,
                cameraRight: this.selected.shadow.camera.right,
                cameraTop: this.selected.shadow.camera.top,
                cameraBottom: this.selected.shadow.camera.bottom,
                cameraNear: this.selected.shadow.camera.near,
                cameraFar: this.selected.shadow.camera.far,
                cameraShow: true,
            });
        } else {
            Object.assign(state, {
                receiveShadow: this.selected.receiveShadow,
                receiveShadowShow: true,
                shadowRadiusShow: false,
                mapSizeShow: false,
                biasShow: false,
                cameraShow: false,
            });
        }

        this.setState(state);
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