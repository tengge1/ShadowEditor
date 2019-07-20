import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, NumberProperty, SelectProperty, ColorProperty } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';

/**
 * 场景组件
 * @author tengge / https://github.com/tengge1
 */
class SceneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.backgroundType = {
            'Color': L_SOLID_COLOR,
            'Image': L_BACKGROUND_IMAGE,
            'SkyBox': L_CUBE_TEXTURE
        };

        this.fogType = {
            'None': L_NONE,
            'Fog': L_LINEAR,
            'FogExp2': L_EXPONENTIAL
        };

        this.state = {
            show: false,
            expanded: true,

            backgroundType: 'Color',

            backgroundColor: '#aaa',
            backgroundColorShow: false,

            backgroundImage: null,
            backgroundImageShow: false,

            backgroundPosX: null,
            backgroundNegX: null,
            backgroundPosY: null,
            backgroundNegY: null,
            backgroundPosZ: null,
            backgroundNegZ: null,
            backgroundCubeTextureShow: false,

            fogType: 'None',
            fogColor: '#555',

            fogNear: 0,
            fogNearShow: false,

            fogFar: 1000,
            fogFarShow: false,

            fogDensity: 0.1,
            fogDensityShow: false,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChangeCastShadow = this.handleChangeCastShadow.bind(this);
    }

    render() {
        const { show, expanded, backgroundType, backgroundColor, backgroundColorShow, backgroundImage, backgroundImageShow,
            backgroundPosX, backgroundNegX, backgroundPosY, backgroundNegY, backgroundPosZ, backgroundNegZ, backgroundCubeTextureShow,
            fogType, fogColor, fogNear, fogNearShow, fogFar, fogFarShow, fogDensity, fogDensityShow } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_SCENE_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <CheckBoxProperty label={L_BACKGROUND} name={'backgroundType'} value={backgroundType} onChange={this.handleChangeCastShadow}></CheckBoxProperty>
            <ColorProperty label={L_BACKGROUND_COLOR} name={'backgroundColor'} value={backgroundColor} show={backgroundColorShow} onChange={this.handleChangeCastShadow}></ColorProperty>


            <CheckBoxProperty label={L_RECEIVE} name={'receiveShadow'} value={receiveShadow} show={receiveShadowShow} onChange={this.handleChangeReceiveShadow}></CheckBoxProperty>
            <NumberProperty label={L_RADIUS} name={'shadowRadius'} value={shadowRadius} show={shadowRadiusShow} onChange={this.handleChangeShadowRadius}></NumberProperty>
            <SelectProperty label={L_MAP_SIZE} options={this.mapSize} name={'mapSize'} value={mapSize.toString()} show={mapSizeShow} onChange={this.handleChangeMapSize}></SelectProperty>
            <NumberProperty label={L_BIAS} name={'bias'} value={bias} show={biasShow} onChange={this.handleChangeBias}></NumberProperty>
            <NumberProperty label={L_CAMERA_LEFT} name={'cameraLeft'} value={cameraLeft} show={cameraShow} onChange={this.handleChangeCameraLeft}></NumberProperty>
            <NumberProperty label={L_CAMERA_RIGHT} name={'cameraRight'} value={cameraRight} show={cameraShow} onChange={this.handleChangeCameraRight}></NumberProperty>
            <NumberProperty label={L_CAMERA_TOP} name={'cameraTop'} value={cameraTop} show={cameraShow} onChange={this.handleChangeCameraTop}></NumberProperty>
            <NumberProperty label={L_CAMERA_BOTTOM} name={'cameraBottom'} value={cameraBottom} show={cameraShow} onChange={this.handleChangeCameraBottom}></NumberProperty>
            <NumberProperty label={L_CAMERA_NEAR} name={'cameraNear'} value={cameraNear} show={cameraShow} onChange={this.handleChangeCameraNear}></NumberProperty>
            <NumberProperty label={L_CAMERA_FAR} name={'cameraFar'} value={cameraFar} show={cameraShow} onChange={this.handleChangeCameraFar}></NumberProperty>
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
                mapSize: this.selected.shadow.mapSize.x,
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

    handleChangeCastShadow(value) {
        this.selected.castShadow = value;

        if (this.selected instanceof THREE.Mesh) {
            this.updateMaterial(this.selected.material);
        }

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeReceiveShadow(value) {
        this.selected.receiveShadow = value;

        if (this.selected instanceof THREE.Mesh) {
            this.updateMaterial(this.selected.material);
        }

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeShadowRadius(value) {
        this.selected.shadow.radius = value;
        app.call(`objectChanged`, this, this.selected);
    }

    updateMaterial(material) {
        if (Array.isArray(material)) {
            material.forEach(n => {
                n.needsUpdate = true;
            });
        } else {
            material.needsUpdate = true;
        }
    }

    handleChangeMapSize(value) {
        this.selected.shadow.mapSize.x = this.selected.shadow.mapSize.y = parseInt(value);
        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeBias(value) {
        this.selected.shadow.bias = value;
        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeCameraLeft(value) {
        this.selected.shadow.camera.left = value;
        this.selected.shadow.camera.updateProjectionMatrix();
        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeCameraRight(value) {
        this.selected.shadow.camera.right = value;
        this.selected.shadow.camera.updateProjectionMatrix();
        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeCameraTop(value) {
        this.selected.shadow.camera.top = value;
        this.selected.shadow.camera.updateProjectionMatrix();
        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeCameraBottom(value) {
        this.selected.shadow.camera.bottom = value;
        this.selected.shadow.camera.updateProjectionMatrix();
        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeCameraNear(value) {
        this.selected.shadow.camera.near = value;
        this.selected.shadow.camera.updateProjectionMatrix();
        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeCameraFar(value) {
        this.selected.shadow.camera.far = value;
        this.selected.shadow.camera.updateProjectionMatrix();
        app.call(`objectChanged`, this, this.selected);
    }
}

export default SceneComponent;