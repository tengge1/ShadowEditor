import UI from '../../ui/UI';
import WebGLRendererSerializer from '../../serialization/core/WebGLRendererSerializer';

/**
 * 选项窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function OptionsWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

OptionsWindow.prototype = Object.create(UI.Control.prototype);
OptionsWindow.prototype.constructor = OptionsWindow;

OptionsWindow.prototype.render = function () {
    var app = this.app;
    var editor = app.editor;
    var scene = editor.scene;
    var renderer = editor.renderer;
    var shadowMap = renderer.shadowMap;

    this.window = UI.create({
        xtype: 'window',
        parent: this.app.container,
        title: '选项窗口',
        width: '500px',
        height: '300px',
        bodyStyle: {
            padding: 0
        },
        shade: false,
        children: [{
            xtype: 'div',
            cls: 'tabs',
            children: [{
                xtype: 'text',
                id: 'surfaceTab',
                scope: this.id,
                text: '外观',
                cls: 'selected',
                onClick: () => {
                    this.changeTab('外观');
                }
            }, {
                xtype: 'text',
                id: 'sceneTab',
                scope: this.id,
                text: '场景',
                onClick: () => {
                    this.changeTab('场景');
                }
            }, {
                xtype: 'text',
                id: 'rendererTab',
                scope: this.id,
                text: '渲染器',
                onClick: () => {
                    this.changeTab('渲染器');
                }
            }]
        }, { // 外观选项卡
            xtype: 'div',
            id: 'surfacePanel',
            scope: this.id,
            cls: 'TabPanel',
            children: [{
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '主题'
                }, {
                    xtype: 'select',
                    id: 'theme',
                    options: {
                        'assets/css/light.css': '浅色',
                        'assets/css/dark.css': '深色'
                    },
                    value: app.options.theme,
                    style: {
                        width: '150px'
                    }
                }]
            }]
        }, { // 场景选项卡
            xtype: 'div',
            id: 'scenePanel',
            scope: this.id,
            cls: 'TabPanel',
            style: {
                display: 'none'
            },
            children: [{
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '背景'
                }, {
                    xtype: 'color',
                    id: 'backgroundColor',
                    scope: this.id,
                    value: `#${scene.background.getHexString()}`
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
                    value: scene.fog == null ? 'None' : ((scene.fog instanceof THREE.FogExp2) ? 'FogExp2' : 'Fog'),
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
                    value: `#${scene.fog == null ? 'aaaaaa' : scene.fog.color.getHexString()}`
                }],
                style: {
                    display: scene.fog == null ? 'none' : ''
                }
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
                    value: (scene.fog && scene.fog instanceof THREE.Fog) ? scene.fog.near : 0.1,
                    range: [0, Infinity]
                }],
                style: {
                    display: (scene.fog && scene.fog instanceof THREE.Fog) ? '' : 'none'
                }
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
                    value: (scene.fog && scene.fog instanceof THREE.Fog) ? scene.fog.far : 50,
                    range: [0, Infinity]
                }],
                style: {
                    display: (scene.fog && scene.fog instanceof THREE.Fog) ? '' : 'none'
                }
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
                    value: (scene.fog && scene.fog instanceof THREE.FogExp2) ? fog.density : 0.05,
                    range: [0, 0.1],
                    precision: 3
                }],
                style: {
                    display: (scene.fog && scene.fog instanceof THREE.FogExp2) ? '' : 'none'
                }
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '网格'
                }, {
                    xtype: 'boolean',
                    id: 'showGrid',
                    scope: this.id,
                    value: this.app.editor.grid.visible
                }]
            }]
        }, { // 渲染器选项卡
            xtype: 'div',
            id: 'rendererPanel',
            scope: this.id,
            cls: 'TabPanel',
            style: {
                display: 'none'
            },
            children: [{
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '阴影'
                }, {
                    xtype: 'select',
                    id: 'shadowMapType',
                    options: {
                        [-1]: '禁用',
                        [THREE.BasicShadowMap]: '基本阴影', // 0
                        [THREE.PCFShadowMap]: 'PCF阴影', // 1
                        [THREE.PCFSoftShadowMap]: 'PCF软阴影' // 2
                    },
                    value: shadowMap.enabled === false ? -1 : shadowMap.type
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: 'γ输入'
                }, {
                    xtype: 'boolean',
                    id: 'gammaInput',
                    value: renderer.gammaInput
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: 'γ输出'
                }, {
                    xtype: 'boolean',
                    id: 'gammaOutput',
                    value: renderer.gammaOutput
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: 'γ因子'
                }, {
                    xtype: 'number',
                    id: 'gammaFactor',
                    value: renderer.gammaFactor
                }]
            }]
        }],
        buttons: [{
            xtype: 'button',
            text: '保存',
            onClick: () => {
                this.save();
            }
        }, {
            xtype: 'button',
            text: '取消',
            onClick: () => {
                this.hide();
            }
        }]
    });
    this.window.render();
};

OptionsWindow.prototype.show = function () {
    this.window.show();
};

OptionsWindow.prototype.hide = function () {
    this.window.hide();
};

OptionsWindow.prototype.changeTab = function (name) {
    if (name === '外观') {
        UI.get('surfaceTab', this.id).dom.classList.add('selected');
        UI.get('sceneTab', this.id).dom.classList.remove('selected');
        UI.get('rendererTab', this.id).dom.classList.remove('selected');
        UI.get('surfacePanel', this.id).dom.style.display = '';
        UI.get('scenePanel', this.id).dom.style.display = 'none';
        UI.get('rendererPanel', this.id).dom.style.display = 'none';
    } else if (name === '场景') {
        UI.get('surfaceTab', this.id).dom.classList.remove('selected');
        UI.get('sceneTab', this.id).dom.classList.add('selected');
        UI.get('rendererTab', this.id).dom.classList.remove('selected');
        UI.get('surfacePanel', this.id).dom.style.display = 'none';
        UI.get('scenePanel', this.id).dom.style.display = '';
        UI.get('rendererPanel', this.id).dom.style.display = 'none';
    } else if (name === '渲染器') {
        UI.get('surfaceTab', this.id).dom.classList.remove('selected');
        UI.get('sceneTab', this.id).dom.classList.remove('selected');
        UI.get('rendererTab', this.id).dom.classList.add('selected');
        UI.get('surfacePanel', this.id).dom.style.display = 'none';
        UI.get('scenePanel', this.id).dom.style.display = 'none';
        UI.get('rendererPanel', this.id).dom.style.display = '';
    }
};

OptionsWindow.prototype.onChangeFogType = function () {
    var fogType = UI.get('fogType', this.id).getValue();
    var fogColorRow = UI.get('fogColorRow', this.id).dom;
    var fogNearRow = UI.get('fogNearRow', this.id).dom;
    var fogFarRow = UI.get('fogFarRow', this.id).dom;
    var fogDensityRow = UI.get('fogDensityRow', this.id).dom;

    switch (fogType) {
        case 'None':
            fogColorRow.style.display = 'none';
            fogNearRow.style.display = 'none';
            fogFarRow.style.display = 'none';
            fogDensityRow.style.display = 'none';
            break;
        case 'Fog':
            fogColorRow.style.display = '';
            fogNearRow.style.display = '';
            fogFarRow.style.display = '';
            fogDensityRow.style.display = 'none';
            break;
        case 'FogExp2':
            fogColorRow.style.display = '';
            fogNearRow.style.display = 'none';
            fogFarRow.style.display = 'none';
            fogDensityRow.style.display = '';
            break;
    }
};

OptionsWindow.prototype.save = function () {
    // 主题
    var theme = UI.get('theme').getValue();
    this.app.options.theme = theme;
    document.getElementById('theme').href = theme;

    // 场景
    var scene = this.app.editor.scene;

    var backgroundColor = UI.get('backgroundColor', this.id).getHexValue();
    scene.background = new THREE.Color(backgroundColor);

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

    var showGrid = UI.get('showGrid', this.id).getValue();
    this.app.editor.grid.visible = showGrid;

    // 渲染器
    var shadowMapType = parseInt(UI.get('shadowMapType').getValue());
    var gammaInput = UI.get('gammaInput').getValue();
    var gammaOutput = UI.get('gammaOutput').getValue();
    var gammaFactor = UI.get('gammaFactor').getValue();

    var renderer = this.app.editor.renderer;
    var json = (new WebGLRendererSerializer(this.app)).toJSON(renderer);
    var newRenderer = (new WebGLRendererSerializer(this.app)).fromJSON(json);

    if (shadowMapType === -1) {
        newRenderer.shadowMap.enabled = false;
    } else {
        newRenderer.shadowMap.enabled = true;
        newRenderer.shadowMap.type = shadowMapType;
    }
    newRenderer.gammaInput = gammaInput;
    newRenderer.gammaOutput = gammaOutput;
    newRenderer.gammaFactor = gammaFactor;

    this.app.viewport.container.dom.removeChild(renderer.domElement);
    this.app.viewport.container.dom.appendChild(newRenderer.domElement);
    this.app.editor.renderer = newRenderer;
    this.app.editor.renderer.setSize(this.app.viewport.container.dom.offsetWidth, this.app.viewport.container.dom.offsetHeight);
    this.app.call('render', this);

    // 隐藏窗口
    this.hide();
    UI.msg('保存成功。');
};

export default OptionsWindow;