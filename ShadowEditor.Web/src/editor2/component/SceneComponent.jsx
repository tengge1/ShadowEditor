import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, NumberProperty, SelectProperty, ColorProperty, TextureProperty, ButtonsProperty, Button } from '../../third_party';
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
            fogColorShow: false,

            fogNear: 0,
            fogNearShow: false,

            fogFar: 1000,
            fogFarShow: false,

            fogDensity: 0.1,
            fogDensityShow: false,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChangeBackgroundType = this.handleChangeBackgroundType.bind(this);
        this.handleChangeBackgroundColor = this.handleChangeBackgroundColor.bind(this);
        this.handleChangeBackgroundImage = this.handleChangeBackgroundImage.bind(this);
        this.handleChangeBackgroundCubeTexture = this.handleChangeBackgroundCubeTexture.bind(this);

        this.handleSelectCubeMap = this.handleSelectCubeMap.bind(this);
        this.handleSaveCubeTexture = this.handleSaveCubeTexture.bind(this);
        this.handleChangeFogType = this.handleChangeFogType.bind(this);
        this.updateFog = this.updateFog.bind(this);
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
            <ColorProperty label={L_FOG_COLOR} name={'fogColor'} value={fogColor} show={fogColorShow} onChange={this.updateFog}></ColorProperty>
            <NumberProperty label={L_FOG_NEAR} name={'fogNear'} value={fogNear} show={fogNearShow} onChange={this.updateFog}></NumberProperty>
            <NumberProperty label={L_FOG_FAR} name={'fogFar'} value={fogFar} show={fogFarShow} onChange={this.updateFog}></NumberProperty>
            <NumberProperty label={L_FOG_DENSITY} name={'fogDensity'} value={fogDensity} show={fogDensityShow} onChange={this.updateFog}></NumberProperty>
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

        if (!editor.selected || !editor.selected === app.editor.scene) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;
        let scene = this.selected;

        let state = {
            show: true,

            // 背景
            backgroundType: `${scene.background instanceof THREE.CubeTexture ? 'SkyBox' : (scene.background instanceof THREE.Texture ? 'Image' : 'Color')}`,
            backgroundColor: `#${scene.background instanceof THREE.Color ? scene.background.getHexString() : 'aaaaaa'}`,
            backgroundColorShow: scene.background instanceof THREE.Color,
            backgroundImage: scene.background instanceof THREE.Texture && !(scene.background instanceof THREE.CubeTexture) ? scene.background : null,
            backgroundImageShow: scene.background instanceof THREE.Texture && !(scene.background instanceof THREE.CubeTexture),
            backgroundPosX: scene.background instanceof THREE.CubeTexture ? new THREE.Texture(scene.background.image[0]) : null,
            backgroundNegX: scene.background instanceof THREE.CubeTexture ? new THREE.Texture(scene.background.image[1]) : null,
            backgroundPosY: scene.background instanceof THREE.CubeTexture ? new THREE.Texture(scene.background.image[2]) : null,
            backgroundNegY: scene.background instanceof THREE.CubeTexture ? new THREE.Texture(scene.background.image[3]) : null,
            backgroundPosZ: scene.background instanceof THREE.CubeTexture ? new THREE.Texture(scene.background.image[4]) : null,
            backgroundNegZ: scene.background instanceof THREE.CubeTexture ? new THREE.Texture(scene.background.image[5]) : null,
            backgroundCubeTextureShow: scene.background instanceof THREE.CubeTexture,

            // 雾效
            fogType: scene.fog == null ? 'None' : ((scene.fog instanceof THREE.FogExp2) ? 'FogExp2' : 'Fog'),
            fogColor: `#${scene.fog == null ? 'aaaaaa' : scene.fog.color.getHexString()}`,
            fogColorShow: scene.fog !== null,
            fogNear: scene.fog && scene.fog instanceof THREE.Fog ? scene.fog.near : 0.1,
            fogNearShow: scene.fog && scene.fog instanceof THREE.Fog,
            fogFar: scene.fog && scene.fog instanceof THREE.Fog ? scene.fog.far : 50,
            fogFarShow: scene.fog && scene.fog instanceof THREE.Fog,
            fogDensity: scene.fog && scene.fog instanceof THREE.FogExp2 ? fog.density : 0.05,
            fogDensityShow: scene.fog && scene.fog instanceof THREE.FogExp2,
        };

        this.setState(state);
    }

    handleChangeBackgroundType(value, name) {
        let scene = this.selected;

        let { backgroundColor, backgroundImage, backgroundPosX, backgroundNegX, backgroundPosY, backgroundNegY, backgroundPosZ, backgroundNegZ } = this.state;

        switch (value) {
            case 'Color':
                scene.background = new THREE.Color(backgroundColor);
                break;
            case 'Image':
                if (backgroundImage) {
                    scene.background = backgroundImage;
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
                }
                break;
        }
    }

    handleChangeBackgroundColor(value, name) {
        this.selected.background = new THREE.Color(value);
        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeBackgroundImage(value, name) {
        this.selected.background = value;
        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeBackgroundCubeTexture(value, name) {
        let { backgroundPosX, backgroundNegX, backgroundPosY, backgroundNegY, backgroundPosZ, backgroundNegZ } = Object.assign({}, this.state, {
            [name]: value,
        });

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
        }

        app.call(`objectChanged`, this, this.selected);
    }

    handleLoadCubeTexture() {
        app.call(`selectBottomPanel`, this, 'map');
        app.msg(L_CLICK_MAP_PANEL);
        app.on(`selectMap.${this.id}`, this.handleSelectCubeMap.bind(this));
    }

    handleSelectCubeMap(model) {
        if (model.Type !== 'cube') {
            UI.msg(L_ONLY_SELECT_CUBE_TEXTURE);
            return;
        }

        app.on(`selectMap.${this.id}`, null);

        var urls = model.Url.split(';');

        var loader = new THREE.TextureLoader();

        var promises = urls.map(url => {
            return new Promise(resolve => {
                loader.load(`${app.options.server}${url}`, texture => {
                    resolve(texture);
                }, undefined, error => {
                    console.error(error);
                    UI.msg(L_CUBE_TEXTURE_FETCH_FAILED);
                });
            });
        });

        Promise.all(promises).then(textures => {
            UI.get('backgroundPosX', this.id).setValue(textures[0]);
            UI.get('backgroundNegX', this.id).setValue(textures[1]);
            UI.get('backgroundPosY', this.id).setValue(textures[2]);
            UI.get('backgroundNegY', this.id).setValue(textures[3]);
            UI.get('backgroundPosZ', this.id).setValue(textures[4]);
            UI.get('backgroundNegZ', this.id).setValue(textures[5]);
            this.updateFog();
        });
    }

    handleSaveCubeTexture() { // 保存立体贴图
        var texturePosX = UI.get('backgroundPosX', this.id).getValue();
        var textureNegX = UI.get('backgroundNegX', this.id).getValue();
        var texturePosY = UI.get('backgroundPosY', this.id).getValue();
        var textureNegY = UI.get('backgroundNegY', this.id).getValue();
        var texturePosZ = UI.get('backgroundPosZ', this.id).getValue();
        var textureNegZ = UI.get('backgroundNegZ', this.id).getValue();

        if (!texturePosX || !textureNegX || !texturePosY || !textureNegY || !texturePosZ || !textureNegZ) {
            UI.msg(L_UPLOAD_ALL_BEFORE_SAVE);
            return;
        }

        var posXSrc = texturePosX.image.src;
        var negXSrc = textureNegX.image.src;
        var posYSrc = texturePosY.image.src;
        var negYSrc = textureNegY.image.src;
        var posZSrc = texturePosZ.image.src;
        var negZSrc = textureNegZ.image.src;

        if (posXSrc.startsWith('http') || negXSrc.startsWith('http') || posYSrc.startsWith('http') || negYSrc.startsWith('http') || posZSrc.startsWith('http') || negZSrc.startsWith('http')) {
            UI.msg(L_CUBE_TEXTURE_EXISTED);
            return;
        }

        var promises = [
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
                var obj = JSON.parse(result);
                UI.msg(obj.Msg);
            });
        });
    }

    handleChangeFogType() { // 切换雾类型
        var fogType = UI.get('fogType', this.id);
        var fogColorRow = UI.get('fogColorRow', this.id);
        var fogNearRow = UI.get('fogNearRow', this.id);
        var fogFarRow = UI.get('fogFarRow', this.id);
        var fogDensityRow = UI.get('fogDensityRow', this.id);

        switch (fogType.getValue()) {
            case 'None':
                fogColorRow.dom.style.display = 'none';
                fogNearRow.dom.style.display = 'none';
                fogFarRow.dom.style.display = 'none';
                fogDensityRow.dom.style.display = 'none';
                break;
            case 'Fog':
                fogColorRow.dom.style.display = '';
                fogNearRow.dom.style.display = '';
                fogFarRow.dom.style.display = '';
                fogDensityRow.dom.style.display = 'none';
                break;
            case 'FogExp2':
                fogColorRow.dom.style.display = '';
                fogNearRow.dom.style.display = 'none';
                fogFarRow.dom.style.display = 'none';
                fogDensityRow.dom.style.display = '';
                break;
        }

        this.updateFog();
    }

    updateFog() {
        var scene = this.selected;

        // 背景
        var backgroundType = UI.get('backgroundType', this.id).getValue();
        var backgroundColor = UI.get('backgroundColor', this.id).getHexValue();
        var backgroundImage = UI.get('backgroundImage', this.id).getValue();
        var backgroundPosX = UI.get('backgroundPosX', this.id).getValue();
        var backgroundNegX = UI.get('backgroundNegX', this.id).getValue();
        var backgroundPosY = UI.get('backgroundPosY', this.id).getValue();
        var backgroundNegY = UI.get('backgroundNegY', this.id).getValue();
        var backgroundPosZ = UI.get('backgroundPosZ', this.id).getValue();
        var backgroundNegZ = UI.get('backgroundNegZ', this.id).getValue();

        switch (backgroundType) {
            case 'Color':
                scene.background = new THREE.Color(backgroundColor);
                break;
            case 'Image':
                if (backgroundImage) {
                    scene.background = backgroundImage;
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
                }
                break;
        }

        // 雾
        var fogType = UI.get('fogType', this.id).getValue();
        var fogColor = UI.get('fogColor', this.id).getHexValue();
        var fogNear = UI.get('fogNear', this.id).getValue();
        var fogFar = UI.get('fogFar', this.id).getValue();
        var fogDensity = UI.get('fogDensity', this.id).getValue();

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
    }
}

export default SceneComponent;