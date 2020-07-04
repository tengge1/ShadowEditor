/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, NumberProperty, SelectProperty, ColorProperty, TextureProperty, ButtonsProperty, Button } from '../../ui/index';
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
            'Color': _t('Solid Color'),
            'Image': _t('Background Image'),
            'SkyBox': _t('Cube Texture')
        };

        this.fogType = {
            'None': _t('None'),
            'Fog': _t('Linear'),
            'FogExp2': _t('Exponential')
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
            fogDensityShow: false
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
            backgroundPosX, backgroundNegX, backgroundPosY, backgroundNegY, backgroundPosZ, backgroundNegZ, backgroundCubeTextureShow,
            fogType, fogColor, fogColorShow, fogNear, fogNearShow, fogFar, fogFarShow, fogDensity, fogDensityShow } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('SceneComponent')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <SelectProperty label={_t('Background')}
                name={'backgroundType'}
                options={this.backgroundType}
                value={backgroundType}
                onChange={this.handleChangeBackgroundType}
            />
            <ColorProperty label={_t('BackgroundColor')}
                name={'backgroundColor'}
                value={backgroundColor}
                show={backgroundColorShow}
                onChange={this.handleChangeBackgroundColor}
            />
            <TextureProperty label={_t('Background Image')}
                name={'backgroundImage'}
                value={backgroundImage}
                show={backgroundImageShow}
                onChange={this.handleChangeBackgroundImage}
            />
            <TextureProperty label={_t('PosX')}
                name={'backgroundPosX'}
                value={backgroundPosX}
                show={backgroundCubeTextureShow}
                onChange={this.handleChangeBackgroundCubeTexture}
            />
            <TextureProperty label={_t('NegX')}
                name={'backgroundNegX'}
                value={backgroundNegX}
                show={backgroundCubeTextureShow}
                onChange={this.handleChangeBackgroundCubeTexture}
            />
            <TextureProperty label={_t('PosY')}
                name={'backgroundPosY'}
                value={backgroundPosY}
                show={backgroundCubeTextureShow}
                onChange={this.handleChangeBackgroundCubeTexture}
            />
            <TextureProperty label={_t('NegY')}
                name={'backgroundNegY'}
                value={backgroundNegY}
                show={backgroundCubeTextureShow}
                onChange={this.handleChangeBackgroundCubeTexture}
            />
            <TextureProperty label={_t('PosZ')}
                name={'backgroundPosZ'}
                value={backgroundPosZ}
                show={backgroundCubeTextureShow}
                onChange={this.handleChangeBackgroundCubeTexture}
            />
            <TextureProperty label={_t('NegZ')}
                name={'backgroundNegZ'}
                value={backgroundNegZ}
                show={backgroundCubeTextureShow}
                onChange={this.handleChangeBackgroundCubeTexture}
            />
            <ButtonsProperty show={backgroundCubeTextureShow}>
                <Button onClick={this.handleLoadCubeTexture}>{_t('Select')}</Button>
                <Button onClick={this.handleSaveCubeTexture}>{_t('Upload')}</Button>
            </ButtonsProperty>
            <SelectProperty label={_t('Fog')}
                name={'fogType'}
                options={this.fogType}
                value={fogType}
                onChange={this.handleChangeFogType}
            />
            <ColorProperty label={_t('FogColor')}
                name={'fogColor'}
                value={fogColor}
                show={fogColorShow}
                onChange={this.handleChangeFogColor}
            />
            <NumberProperty label={_t('FogNear')}
                name={'fogNear'}
                value={fogNear}
                show={fogNearShow}
                onChange={this.handleChangeFogNear}
            />
            <NumberProperty label={_t('FogFar')}
                name={'fogFar'}
                value={fogFar}
                show={fogFarShow}
                onChange={this.handleChangeFogFar}
            />
            <NumberProperty label={_t('FogDensity')}
                name={'fogDensity'}
                value={fogDensity}
                show={fogDensityShow}
                onChange={this.handleChangeFogDensity}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.SceneComponent`, this.handleUpdate);
        app.on(`objectChanged.SceneComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== app.editor.scene) {
            this.setState({
                show: false
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
            backgroundType: background instanceof THREE.CubeTexture ? 'SkyBox' : background instanceof THREE.Texture ? 'Image' : 'Color',
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
            fogType: fog === null ? 'None' : fog instanceof THREE.FogExp2 ? 'FogExp2' : 'Fog',
            fogColor: fog === null ? fogColor : `#${fog.color.getHexString()}`,
            fogColorShow: fog !== null,
            fogNear: fog instanceof THREE.Fog ? fog.near : fogNear,
            fogNearShow: fog !== null && fog instanceof THREE.Fog,
            fogFar: fog instanceof THREE.Fog ? fog.far : fogFar,
            fogFarShow: fog instanceof THREE.Fog,
            fogDensity: fog instanceof THREE.FogExp2 ? fog.density : fogDensity,
            fogDensityShow: fog instanceof THREE.FogExp2
        };

        this.setState(state);
    }

    handleChangeBackgroundType(value, name) {
        const {
            backgroundType, backgroundColor, backgroundImage,
            backgroundPosX, backgroundNegX, backgroundPosY, backgroundNegY, backgroundPosZ, backgroundNegZ
        } = Object.assign({}, this.state, {
            [name]: value
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
                        backgroundCubeTextureShow: false
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
                        backgroundCubeTextureShow: true
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
                [name]: value
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
                [name]: value
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
                [name]: value
            });
            return;
        }

        const { backgroundPosX, backgroundNegX, backgroundPosY, backgroundNegY, backgroundPosZ, backgroundNegZ } = Object.assign({}, this.state, {
            [name]: value
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
                [name]: value
            });
        }
    }

    handleLoadCubeTexture() {
        app.call(`selectBottomPanel`, this, 'map');

        app.toast(_t('Please click the map in the Map Panel.'));

        app.on(`selectMap.SceneComponent`, this.handleSelectCubeMap);
    }

    handleSelectCubeMap(model) {
        if (model.Type !== 'cube') {
            app.toast(_t('You should select Cube Texture.'));

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
                    app.toast(_t('Cube Texture fetch failed.'), 'warn');
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
            app.toast(_t('Please upload all the textures before save.'), 'warn');
            return;
        }

        const posXSrc = backgroundPosX.image.src;
        const negXSrc = backgroundNegX.image.src;
        const posYSrc = backgroundPosY.image.src;
        const negYSrc = backgroundNegY.image.src;
        const posZSrc = backgroundPosZ.image.src;
        const negZSrc = backgroundNegZ.image.src;

        if (posXSrc.startsWith('http') || negXSrc.startsWith('http') || posYSrc.startsWith('http') || negYSrc.startsWith('http') || posZSrc.startsWith('http') || negZSrc.startsWith('http')) {
            app.toast(_t('Cube texture has already been uploaded.'), 'warn');
            return;
        }

        const promises = [
            Converter.dataURLtoFile(posXSrc, 'posX'),
            Converter.dataURLtoFile(negXSrc, 'negX'),
            Converter.dataURLtoFile(posYSrc, 'posY'),
            Converter.dataURLtoFile(negYSrc, 'negY'),
            Converter.dataURLtoFile(posZSrc, 'posZ'),
            Converter.dataURLtoFile(negZSrc, 'negZ')
        ];

        Promise.all(promises).then(files => {
            Ajax.post(`${app.options.server}/api/Map/Add`, {
                posX: files[0],
                negX: files[1],
                posY: files[2],
                negY: files[3],
                posZ: files[4],
                negZ: files[5]
            }, result => {
                let obj = JSON.parse(result);
                app.toast(_t(obj.Msg));
            });
        });
    }

    handleChangeFogType(value, name) {
        const { fogType, fogColor, fogNear, fogFar, fogDensity } = Object.assign({}, this.state, {
            [name]: value
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
                [name]: value
            });
            return;
        }

        this.selected.fog.color.set(value);

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeFogNear(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.fog.near = value;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeFogFar(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.fog.far = value;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeFogDensity(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        this.selected.fog.density = value;

        app.call(`objectChanged`, this, this.selected);
    }
}

export default SceneComponent;