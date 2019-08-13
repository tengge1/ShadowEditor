import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, NumberProperty, SelectProperty, ColorProperty, TextureProperty, ButtonsProperty, Button } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';
import Converter from '../../utils/Converter';
import Ajax from '../../utils/Ajax';

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

            backgroundColor: '#aaaaaa',
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

            fogColor: '#aaaaaa',
            fogColorShow: false,

            fogNear: 0.1,
            fogNearShow: false,

            fogFar: 50,
            fogFarShow: false,

            fogDensity: 0.05,
            fogDensityShow: false,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChangeBackgroundType = this.handleChangeBackgroundType.bind(this);
        this.handleChangeBackgroundColor = this.handleChangeBackgroundColor.bind(this);
        this.handleChangeBackgroundImage = this.handleChangeBackgroundImage.bind(this);
        this.handleChangeBackgroundCubeTexture = this.handleChangeBackgroundCubeTexture.bind(this);

        this.handleLoadCubeTexture = this.handleLoadCubeTexture.bind(this);
        this.handleSelectCubeMap = this.handleSelectCubeMap.bind(this);
        this.handleSaveCubeTexture = this.handleSaveCubeTexture.bind(this);

        this.handleChangeFogType = this.handleChangeFogType.bind(this);
        this.handleChangeFogColor = this.handleChangeFogColor.bind(this);
        this.handleChangeFogNear = this.handleChangeFogNear.bind(this);
        this.handleChangeFogFar = this.handleChangeFogFar.bind(this);
        this.handleChangeFogDensity = this.handleChangeFogDensity.bind(this);
    }

    render() {
        const { show, expanded, backgroundType, backgroundColor, backgroundColorShow, backgroundImage, backgroundImageShow,
            backgroundPosX, backgroundNegX, backgroundPosY, backgroundNegY, backgroundPosZ, backgroundNegZ, backgroundCubeTextureShow, backgroundCubeTextureCommandShow,
            fogType, fogColor, fogColorShow, fogNear, fogNearShow, fogFar, fogFarShow, fogDensity, fogDensityShow } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_SCENE_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <SelectProperty label={L_BACKGROUND} name={'backgroundType'} options={this.backgroundType} value={backgroundType} onChange={this.handleChangeBackgroundType}></SelectProperty>
            <ColorProperty label={L_BACKGROUND_COLOR} name={'backgroundColor'} value={backgroundColor} show={backgroundColorShow} onChange={this.handleChangeBackgroundColor}></ColorProperty>
            <TextureProperty label={L_BACKGROUND_IMAGE} name={'backgroundImage'} value={backgroundImage} show={backgroundImageShow} onChange={this.handleChangeBackgroundImage}></TextureProperty>
            <TextureProperty label={L_POS_X} name={'backgroundPosX'} value={backgroundPosX} show={backgroundCubeTextureShow} onChange={this.handleChangeBackgroundCubeTexture}></TextureProperty>
            <TextureProperty label={L_NEG_X} name={'backgroundNegX'} value={backgroundNegX} show={backgroundCubeTextureShow} onChange={this.handleChangeBackgroundCubeTexture}></TextureProperty>
            <TextureProperty label={L_POS_Y} name={'backgroundPosY'} value={backgroundPosY} show={backgroundCubeTextureShow} onChange={this.handleChangeBackgroundCubeTexture}></TextureProperty>
            <TextureProperty label={L_NEG_Y} name={'backgroundNegY'} value={backgroundNegY} show={backgroundCubeTextureShow} onChange={this.handleChangeBackgroundCubeTexture}></TextureProperty>
            <TextureProperty label={L_POS_Z} name={'backgroundPosZ'} value={backgroundPosZ} show={backgroundCubeTextureShow} onChange={this.handleChangeBackgroundCubeTexture}></TextureProperty>
            <TextureProperty label={L_NEG_Z} name={'backgroundNegZ'} value={backgroundNegZ} show={backgroundCubeTextureShow} onChange={this.handleChangeBackgroundCubeTexture}></TextureProperty>
            <ButtonsProperty show={backgroundCubeTextureShow}>
                <Button onClick={this.handleLoadCubeTexture}>{L_SELECT}</Button>
                <Button onClick={this.handleSaveCubeTexture}>{L_UPLOAD}</Button>
            </ButtonsProperty>
            <SelectProperty label={L_FOG} name={'fogType'} options={this.fogType} value={fogType} onChange={this.handleChangeFogType}></SelectProperty>
            <ColorProperty label={L_FOG_COLOR} name={'fogColor'} value={fogColor} show={fogColorShow} onChange={this.handleChangeFogColor}></ColorProperty>
            <NumberProperty label={L_FOG_NEAR} name={'fogNear'} value={fogNear} show={fogNearShow} onChange={this.handleChangeFogNear}></NumberProperty>
            <NumberProperty label={L_FOG_FAR} name={'fogFar'} value={fogFar} show={fogFarShow} onChange={this.handleChangeFogFar}></NumberProperty>
            <NumberProperty label={L_FOG_DENSITY} name={'fogDensity'} value={fogDensity} show={fogDensityShow} onChange={this.handleChangeFogDensity}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.SceneComponent`, this.handleUpdate);
        app.on(`objectChanged.SceneComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== app.editor.scene) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        const background = this.selected.background;
        const fog = this.selected.fog;

        const { backgroundColor, fogColor, fogNear, fogFar, fogDensity } = this.state;

        let state = {
            show: true,

            // 背景
            backgroundType: background instanceof THREE.CubeTexture ? 'SkyBox' : (background instanceof THREE.Texture ? 'Image' : 'Color'),
            backgroundColor: background instanceof THREE.Color ? `#${background.getHexString()}` : backgroundColor,
            backgroundColorShow: background instanceof THREE.Color,
            backgroundImage: background instanceof THREE.Texture && !(background instanceof THREE.CubeTexture) ? background : null,
            backgroundImageShow: background instanceof THREE.Texture && !(background instanceof THREE.CubeTexture),
            backgroundPosX: background instanceof THREE.CubeTexture ? new THREE.Texture(background.image[0]) : null,
            backgroundNegX: background instanceof THREE.CubeTexture ? new THREE.Texture(background.image[1]) : null,
            backgroundPosY: background instanceof THREE.CubeTexture ? new THREE.Texture(background.image[2]) : null,
            backgroundNegY: background instanceof THREE.CubeTexture ? new THREE.Texture(background.image[3]) : null,
            backgroundPosZ: background instanceof THREE.CubeTexture ? new THREE.Texture(background.image[4]) : null,
            backgroundNegZ: background instanceof THREE.CubeTexture ? new THREE.Texture(background.image[5]) : null,
            backgroundCubeTextureShow: background instanceof THREE.CubeTexture,

            // 雾效
            fogType: fog == null ? 'None' : (fog instanceof THREE.FogExp2 ? 'FogExp2' : 'Fog'),
            fogColor: fog == null ? fogColor : `#${fog.color.getHexString()}`,
            fogColorShow: fog !== null,
            fogNear: fog instanceof THREE.Fog ? fog.near : fogNear,
            fogNearShow: fog !== null && fog instanceof THREE.Fog,
            fogFar: fog instanceof THREE.Fog ? fog.far : fogFar,
            fogFarShow: fog instanceof THREE.Fog,
            fogDensity: fog instanceof THREE.FogExp2 ? fog.density : fogDensity,
            fogDensityShow: fog instanceof THREE.FogExp2,
        };

        this.setState(state);
    }

    handleChangeBackgroundType(value, name) {
        const {
            backgroundType, backgroundColor, backgroundImage,
            backgroundPosX, backgroundNegX, backgroundPosY, backgroundNegY, backgroundPosZ, backgroundNegZ
        } = Object.assign({}, this.state, {
            [name]: value,
        });

        let scene = this.selected;

        switch (backgroundType) {
            case 'Color':
                scene.background = new THREE.Color(backgroundColor);
                break;
            case 'Image':
                if (backgroundImage) {
                    scene.background = backgroundImage;
                } else {
                    scene.background = new THREE.Color(backgroundColor);
                    this.setState({
                        [name]: value,
                        backgroundColorShow: false,
                        backgroundImageShow: true,
                        backgroundCubeTextureShow: false,
                    });
                    return;
                }
                break;
            case 'SkyBox':
                if (backgroundPosX && backgroundNegX && backgroundPosY && backgroundNegY && backgroundPosZ && backgroundNegZ) {
                    scene.background = new THREE.CubeTexture([
                        backgroundPosX.image,
                        backgroundNegX.image,
                        backgroundPosY.image,
                        backgroundNegY.image,
                        backgroundPosZ.image,
                        backgroundNegZ.image
                    ]);
                    scene.background.needsUpdate = true;
                } else {
                    scene.background = new THREE.Color(backgroundColor);
                    this.setState({
                        [name]: value,
                        backgroundColorShow: false,
                        backgroundImageShow: false,
                        backgroundCubeTextureShow: true,
                    });
                    return;
                }
                break;
        }

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeBackgroundColor(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        this.selected.background = new THREE.Color(value);

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeBackgroundImage(value, name) {
        if (value === null) {
            this.selected.background = new THREE.Color(this.state.backgroundColor);

            this.setState({
                [name]: value,
            });
            return;
        }

        this.selected.background = value;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeBackgroundCubeTexture(value, name) {
        if (value === null) {
            this.selected.background = new THREE.Color(this.state.backgroundColor);

            this.setState({
                [name]: value,
            });
            return;
        }

        const { backgroundPosX, backgroundNegX, backgroundPosY, backgroundNegY, backgroundPosZ, backgroundNegZ } = Object.assign({}, this.state, {
            [name]: value,
        });

        if (backgroundPosX && backgroundNegX && backgroundPosY && backgroundNegY && backgroundPosZ && backgroundNegZ) {
            let scene = this.selected;

            scene.background = new THREE.CubeTexture([
                backgroundPosX.image,
                backgroundNegX.image,
                backgroundPosY.image,
                backgroundNegY.image,
                backgroundPosZ.image,
                backgroundNegZ.image
            ]);

            scene.background.needsUpdate = true;

            app.call(`objectChanged`, this, this.selected);
        } else {
            this.setState({
                [name]: value,
            });
        }
    }

    handleLoadCubeTexture() {
        app.call(`selectBottomPanel`, this, 'map');

        app.toast(L_CLICK_MAP_PANEL);

        app.on(`selectMap.SceneComponent`, this.handleSelectCubeMap);
    }

    handleSelectCubeMap(model) {
        if (model.Type !== 'cube') {
            app.toast(L_ONLY_SELECT_CUBE_TEXTURE);

            return;
        }

        app.on(`selectMap.SceneComponent`, null);

        var urls = model.Url.split(';');

        var loader = new THREE.TextureLoader();

        var promises = urls.map(url => {
            return new Promise(resolve => {
                loader.load(`${app.options.server}${url}`, texture => {
                    resolve(texture);
                }, undefined, error => {
                    console.error(error);
                    app.toast(L_CUBE_TEXTURE_FETCH_FAILED);
                });
            });
        });

        let scene = this.selected;

        Promise.all(promises).then(textures => {
            scene.background = new THREE.CubeTexture([
                textures[0].image,
                textures[1].image,
                textures[2].image,
                textures[3].image,
                textures[4].image,
                textures[5].image
            ]);

            scene.background.needsUpdate = true;

            app.call(`objectChanged`, this, this.selected);
        });
    }

    handleSaveCubeTexture() {
        const { backgroundPosX, backgroundNegX, backgroundPosY, backgroundNegY, backgroundPosZ, backgroundNegZ } = this.state;

        if (!backgroundPosX || !backgroundNegX || !backgroundPosY || !backgroundNegY || !backgroundPosZ || !backgroundNegZ) {
            app.toast(L_UPLOAD_ALL_BEFORE_SAVE);
            return;
        }

        const posXSrc = backgroundPosX.image.src;
        const negXSrc = backgroundNegX.image.src;
        const posYSrc = backgroundPosY.image.src;
        const negYSrc = backgroundNegY.image.src;
        const posZSrc = backgroundPosZ.image.src;
        const negZSrc = backgroundNegZ.image.src;

        if (posXSrc.startsWith('http') || negXSrc.startsWith('http') || posYSrc.startsWith('http') || negYSrc.startsWith('http') || posZSrc.startsWith('http') || negZSrc.startsWith('http')) {
            app.toast(L_CUBE_TEXTURE_EXISTED);
            return;
        }

        const promises = [
            Converter.dataURLtoFile(posXSrc, 'posX'),
            Converter.dataURLtoFile(negXSrc, 'negX'),
            Converter.dataURLtoFile(posYSrc, 'posY'),
            Converter.dataURLtoFile(negYSrc, 'negY'),
            Converter.dataURLtoFile(posZSrc, 'posZ'),
            Converter.dataURLtoFile(negZSrc, 'negZ'),
        ];

        Promise.all(promises).then(files => {
            Ajax.post(`${app.options.server}/api/Map/Add`, {
                posX: files[0],
                negX: files[1],
                posY: files[2],
                negY: files[3],
                posZ: files[4],
                negZ: files[5],
            }, result => {
                let obj = JSON.parse(result);
                app.toast(obj.Msg);
            });
        });
    }

    handleChangeFogType(value, name) {
        const { fogType, fogColor, fogNear, fogFar, fogDensity } = Object.assign({}, this.state, {
            [name]: value,
        });

        let scene = this.selected;

        switch (fogType) {
            case 'None':
                scene.fog = null;
                break;
            case 'Fog':
                scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
                break;
            case 'FogExp2':
                scene.fog = new THREE.FogExp2(fogColor, fogDensity);
                break;
        }

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeFogColor(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        this.selected.fog.color.set(value);

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeFogNear(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        this.selected.fog.near = value;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeFogFar(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        this.selected.fog.far = value;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeFogDensity(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        this.selected.fog.density = value;

        app.call(`objectChanged`, this, this.selected);
    }
}

export default SceneComponent;