import UI from '../../ui/UI';

/**
 * 设置面板
 * @author tengge / https://github.com/tengge1
 */
function SettingPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

SettingPanel.prototype = Object.create(UI.Control.prototype);
SettingPanel.prototype.constructor = SettingPanel;

SettingPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: 0,
            paddingTop: '20px'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '背景'
            }, {
                xtype: 'select',
                id: 'backgroundType',
                scope: this.id,
                options: {
                    'Color': '纯色',
                    'Image': '背景图片',
                    'SkyBox': '立体贴图'
                },
                onChange: this.onChangeBackgroundType.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'backgroundColorRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '背景颜色'
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
                text: '背景图片'
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
                text: 'x轴正向'
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
                text: 'x轴负向'
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
                text: 'y轴正向'
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
                text: 'y轴负向'
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
                text: 'z轴正向'
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
                text: 'z轴负向'
            }, {
                xtype: 'texture',
                id: 'backgroundNegZ',
                scope: this.id,
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '雾'
            }, {
                xtype: 'select',
                id: 'fogType',
                scope: this.id,
                options: {
                    'None': '无',
                    'Fog': '线性',
                    'FogExp2': '指数型'
                },
                onChange: this.onChangeFogType.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'fogColorRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '雾颜色'
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
                text: '雾近点'
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
                text: '雾远点'
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
                text: '雾浓度'
            }, {
                xtype: 'number',
                id: 'fogDensity',
                scope: this.id,
                range: [0, 0.1],
                precision: 3,
                onChange: this.update.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '网格'
            }, {
                xtype: 'boolean',
                id: 'showGrid',
                scope: this.id,
                onChange: this.update.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`selectTab.${this.id}`, this.onSelectTab.bind(this));
};

SettingPanel.prototype.onSelectTab = function (tabName) {
    if (tabName !== 'setting') {
        return;
    }

    var scene = this.app.editor.scene;

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

    // 网格
    var showGrid = UI.get('showGrid', this.id);
    showGrid.setValue(this.app.editor.grid.visible);
};

SettingPanel.prototype.onChangeBackgroundType = function () { // 切换背景类型
    var backgroundType = UI.get('backgroundType', this.id);

    var backgroundColorRow = UI.get('backgroundColorRow', this.id);
    var backgroundImageRow = UI.get('backgroundImageRow', this.id);
    var backgroundPosXRow = UI.get('backgroundPosXRow', this.id);
    var backgroundNegXRow = UI.get('backgroundNegXRow', this.id);
    var backgroundPosYRow = UI.get('backgroundPosYRow', this.id);
    var backgroundNegYRow = UI.get('backgroundNegYRow', this.id);
    var backgroundPosZRow = UI.get('backgroundPosZRow', this.id);
    var backgroundNegZRow = UI.get('backgroundNegZRow', this.id);

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
            break;
    }

    this.update();
};

SettingPanel.prototype.onChangeFogType = function () { // 切换雾类型
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

SettingPanel.prototype.update = function () {
    var scene = this.app.editor.scene;

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

    // 网格
    var showGrid = UI.get('showGrid', this.id).getValue();
    this.app.editor.grid.visible = showGrid;
};

export default SettingPanel;