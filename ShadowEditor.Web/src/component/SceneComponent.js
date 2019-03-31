import BaseComponent from './BaseComponent';
import Converter from '../utils/Converter';
import Ajax from '../utils/Ajax';

/**
 * 场景组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SceneComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

SceneComponent.prototype = Object.create(BaseComponent.prototype);
SceneComponent.prototype.constructor = SceneComponent;

SceneComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'scenePanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: L_SCENE_COMPONENT
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BACKGROUND
            }, {
                xtype: 'select',
                id: 'backgroundType',
                scope: this.id,
                options: {
                    'Color': L_SOLID_COLOR,
                    'Image': L_BACKGROUND_IMAGE,
                    'SkyBox': L_CUBE_TEXTURE
                },
                onChange: this.onChangeBackgroundType.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'backgroundColorRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_BACKGROUND_COLOR
            }, {
                xtype: 'color',
                id: 'backgroundColor',
                scope: this.id,
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'backgroundImageRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_BACKGROUND_IMAGE
            }, {
                xtype: 'texture',
                id: 'backgroundImage',
                scope: this.id,
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'backgroundPosXRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_POS_X
            }, {
                xtype: 'texture',
                id: 'backgroundPosX',
                scope: this.id,
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'backgroundNegXRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_NEG_X
            }, {
                xtype: 'texture',
                id: 'backgroundNegX',
                scope: this.id,
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'backgroundPosYRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_POS_Y
            }, {
                xtype: 'texture',
                id: 'backgroundPosY',
                scope: this.id,
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'backgroundNegYRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_NEG_Y
            }, {
                xtype: 'texture',
                id: 'backgroundNegY',
                scope: this.id,
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'backgroundPosZRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_POS_Z
            }, {
                xtype: 'texture',
                id: 'backgroundPosZ',
                scope: this.id,
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'backgroundNegZRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_NEG_Z
            }, {
                xtype: 'texture',
                id: 'backgroundNegZ',
                scope: this.id,
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'cubeTextureCommandRow',
            scope: this.id,
            style: {
                display: 'none'
            },
            children: [{
                xtype: 'button',
                text: L_SELECT,
                onClick: this.onLoadCubeTexture.bind(this)
            }, {
                xtype: 'button',
                text: L_UPLOAD,
                style: {
                    marginLeft: '8px'
                },
                onClick: this.onSaveCubeTexture.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_FOG
            }, {
                xtype: 'select',
                id: 'fogType',
                scope: this.id,
                options: {
                    'None': L_NONE,
                    'Fog': L_LINEAR,
                    'FogExp2': L_EXPONENTIAL
                },
                onChange: this.onChangeFogType.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'fogColorRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_FOG_COLOR
            }, {
                xtype: 'color',
                id: 'fogColor',
                scope: this.id,
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'fogNearRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_FOG_NEAR
            }, {
                xtype: 'number',
                id: 'fogNear',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'fogFarRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_FOG_FAR
            }, {
                xtype: 'number',
                id: 'fogFar',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'fogDensityRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: L_FOG_DENSITY
            }, {
                xtype: 'number',
                id: 'fogDensity',
                scope: this.id,
                range: [0, 0.1],
                precision: 3,
                onChange: this.update.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

SceneComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

SceneComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

SceneComponent.prototype.updateUI = function () {
    var container = UI.get('scenePanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected === editor.scene) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;
    var scene = this.selected;

    // 背景
    var backgroundColorRow = UI.get('backgroundColorRow', this.id);
    var backgroundImageRow = UI.get('backgroundImageRow', this.id);
    var backgroundPosXRow = UI.get('backgroundPosXRow', this.id);
    var backgroundNegXRow = UI.get('backgroundNegXRow', this.id);
    var backgroundPosYRow = UI.get('backgroundPosYRow', this.id);
    var backgroundNegYRow = UI.get('backgroundNegYRow', this.id);
    var backgroundPosZRow = UI.get('backgroundPosZRow', this.id);
    var backgroundNegZRow = UI.get('backgroundNegZRow', this.id);

    var backgroundType = UI.get('backgroundType', this.id);
    var backgroundColor = UI.get('backgroundColor', this.id);
    var backgroundImage = UI.get('backgroundImage', this.id);
    var backgroundPosX = UI.get('backgroundPosX', this.id);
    var backgroundNegX = UI.get('backgroundNegX', this.id);
    var backgroundPosY = UI.get('backgroundPosY', this.id);
    var backgroundNegY = UI.get('backgroundNegY', this.id);
    var backgroundPosZ = UI.get('backgroundPosZ', this.id);
    var backgroundNegZ = UI.get('backgroundNegZ', this.id);

    backgroundType.setValue(`${scene.background instanceof THREE.CubeTexture ? 'SkyBox' : (scene.background instanceof THREE.Texture ? 'Image' : 'Color')}`);

    backgroundColorRow.dom.style.display = scene.background instanceof THREE.Color ? '' : 'none';
    backgroundColor.setValue(`#${scene.background instanceof THREE.Color ? scene.background.getHexString() : 'aaaaaa'}`);

    backgroundImageRow.dom.style.display = (scene.background instanceof THREE.Texture && !(scene.background instanceof THREE.CubeTexture)) ? '' : 'none';
    backgroundImage.setValue((scene.background instanceof THREE.Texture && !(scene.background instanceof THREE.CubeTexture)) ? scene.background : null);

    backgroundPosXRow.dom.style.display = scene.background instanceof THREE.CubeTexture ? '' : 'none';
    backgroundNegXRow.dom.style.display = scene.background instanceof THREE.CubeTexture ? '' : 'none';
    backgroundPosYRow.dom.style.display = scene.background instanceof THREE.CubeTexture ? '' : 'none';
    backgroundNegYRow.dom.style.display = scene.background instanceof THREE.CubeTexture ? '' : 'none';
    backgroundPosZRow.dom.style.display = scene.background instanceof THREE.CubeTexture ? '' : 'none';
    backgroundNegZRow.dom.style.display = scene.background instanceof THREE.CubeTexture ? '' : 'none';

    backgroundPosX.setValue(scene.background instanceof THREE.CubeTexture ? new THREE.Texture(scene.background.image[0]) : null);
    backgroundNegX.setValue(scene.background instanceof THREE.CubeTexture ? new THREE.Texture(scene.background.image[1]) : null);
    backgroundPosY.setValue(scene.background instanceof THREE.CubeTexture ? new THREE.Texture(scene.background.image[2]) : null);
    backgroundNegY.setValue(scene.background instanceof THREE.CubeTexture ? new THREE.Texture(scene.background.image[3]) : null);
    backgroundPosZ.setValue(scene.background instanceof THREE.CubeTexture ? new THREE.Texture(scene.background.image[4]) : null);
    backgroundNegZ.setValue(scene.background instanceof THREE.CubeTexture ? new THREE.Texture(scene.background.image[5]) : null);

    // 雾效
    var fogColorRow = UI.get('fogColorRow', this.id);
    var fogNearRow = UI.get('fogNearRow', this.id);
    var fogFarRow = UI.get('fogFarRow', this.id);
    var fogDensityRow = UI.get('fogDensityRow', this.id);

    var fogType = UI.get('fogType', this.id);
    var fogColor = UI.get('fogColor', this.id);
    var fogNear = UI.get('fogNear', this.id);
    var fogFar = UI.get('fogFar', this.id);
    var fogDensity = UI.get('fogDensity', this.id);

    fogType.setValue(scene.fog == null ? 'None' : ((scene.fog instanceof THREE.FogExp2) ? 'FogExp2' : 'Fog'));

    fogColorRow.dom.style.display = scene.fog == null ? 'none' : '';
    fogColor.setValue(`#${scene.fog == null ? 'aaaaaa' : scene.fog.color.getHexString()}`);

    fogNearRow.dom.style.display = (scene.fog && scene.fog instanceof THREE.Fog) ? '' : 'none';
    fogNear.setValue((scene.fog && scene.fog instanceof THREE.Fog) ? scene.fog.near : 0.1);

    fogFarRow.dom.style.display = (scene.fog && scene.fog instanceof THREE.Fog) ? '' : 'none';
    fogFar.setValue((scene.fog && scene.fog instanceof THREE.Fog) ? scene.fog.far : 50);

    fogDensityRow.dom.style.display = (scene.fog && scene.fog instanceof THREE.FogExp2) ? '' : 'none';
    fogDensity.setValue((scene.fog && scene.fog instanceof THREE.FogExp2) ? fog.density : 0.05);
};

SceneComponent.prototype.onChangeBackgroundType = function () { // 切换背景类型
    var backgroundType = UI.get('backgroundType', this.id);

    var backgroundColorRow = UI.get('backgroundColorRow', this.id);
    var backgroundImageRow = UI.get('backgroundImageRow', this.id);
    var backgroundPosXRow = UI.get('backgroundPosXRow', this.id);
    var backgroundNegXRow = UI.get('backgroundNegXRow', this.id);
    var backgroundPosYRow = UI.get('backgroundPosYRow', this.id);
    var backgroundNegYRow = UI.get('backgroundNegYRow', this.id);
    var backgroundPosZRow = UI.get('backgroundPosZRow', this.id);
    var backgroundNegZRow = UI.get('backgroundNegZRow', this.id);

    var cubeTextureCommandRow = UI.get('cubeTextureCommandRow', this.id);

    switch (backgroundType.getValue()) {
        case 'Color':
            backgroundColorRow.dom.style.display = '';
            backgroundImageRow.dom.style.display = 'none';
            backgroundPosXRow.dom.style.display = 'none';
            backgroundNegXRow.dom.style.display = 'none';
            backgroundPosYRow.dom.style.display = 'none';
            backgroundNegYRow.dom.style.display = 'none';
            backgroundPosZRow.dom.style.display = 'none';
            backgroundNegZRow.dom.style.display = 'none';
            cubeTextureCommandRow.dom.style.display = 'none';
            break;
        case 'Image':
            backgroundColorRow.dom.style.display = 'none';
            backgroundImageRow.dom.style.display = '';
            backgroundPosXRow.dom.style.display = 'none';
            backgroundNegXRow.dom.style.display = 'none';
            backgroundPosYRow.dom.style.display = 'none';
            backgroundNegYRow.dom.style.display = 'none';
            backgroundPosZRow.dom.style.display = 'none';
            backgroundNegZRow.dom.style.display = 'none';
            cubeTextureCommandRow.dom.style.display = 'none';
            break;
        case 'SkyBox':
            backgroundColorRow.dom.style.display = 'none';
            backgroundImageRow.dom.style.display = 'none';
            backgroundPosXRow.dom.style.display = '';
            backgroundNegXRow.dom.style.display = '';
            backgroundPosYRow.dom.style.display = '';
            backgroundNegYRow.dom.style.display = '';
            backgroundPosZRow.dom.style.display = '';
            backgroundNegZRow.dom.style.display = '';
            cubeTextureCommandRow.dom.style.display = '';
            break;
    }

    this.update();
};

SceneComponent.prototype.onLoadCubeTexture = function () { // 加载立体贴图
    this.app.call(`selectBottomPanel`, this, 'map');
    UI.msg(L_CLICK_MAP_PANEL);
    this.app.on(`selectMap.${this.id}`, this.onSelectCubeMap.bind(this));
};

SceneComponent.prototype.onSelectCubeMap = function (model) {
    if (model.Type !== 'cube') {
        UI.msg(L_ONLY_SELECT_CUBE_TEXTURE);
        return;
    }

    this.app.on(`selectMap.${this.id}`, null);

    var urls = model.Url.split(';');

    var loader = new THREE.TextureLoader();

    var promises = urls.map(url => {
        return new Promise(resolve => {
            loader.load(`${this.app.options.server}${url}`, texture => {
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
        this.update();
    });
};

SceneComponent.prototype.onSaveCubeTexture = function () { // 保存立体贴图
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
        Ajax.post(`${this.app.options.server}/api/Map/Add`, {
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
};

SceneComponent.prototype.onChangeFogType = function () { // 切换雾类型
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

    this.update();
};

SceneComponent.prototype.update = function () {
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
};

export default SceneComponent;