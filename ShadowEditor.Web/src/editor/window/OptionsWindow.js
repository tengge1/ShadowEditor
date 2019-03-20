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
        title: L_OPTIONS_WINDOW,
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
                text: L_SURFACE,
                cls: 'selected',
                onClick: () => {
                    this.changeTab(L_SURFACE);
                }
            }, {
                xtype: 'text',
                id: 'rendererTab',
                scope: this.id,
                text: L_RENDERER,
                onClick: () => {
                    this.changeTab(L_RENDERER);
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
                    text: L_THEME
                }, {
                    xtype: 'select',
                    id: 'theme',
                    scope: this.id,
                    options: {
                        'assets/css/light.css': L_LIGHT_COLOR,
                        'assets/css/dark.css': L_DARK_COLOR
                    },
                    style: {
                        width: '150px'
                    }
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
                    text: L_SHADOW
                }, {
                    xtype: 'select',
                    id: 'shadowMapType',
                    scope: this.id,
                    options: {
                        [-1]: L_DISABLED,
                        [THREE.BasicShadowMap]: L_BASIC_SHADOW, // 0
                        [THREE.PCFShadowMap]: L_PCF_SHADOW, // 1
                        [THREE.PCFSoftShadowMap]: L_PCF_SOFT_SHADOW // 2
                    }
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_GAMMA_INPUT
                }, {
                    xtype: 'boolean',
                    id: 'gammaInput',
                    scope: this.id,
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_GAMMA_OUTPUT
                }, {
                    xtype: 'boolean',
                    id: 'gammaOutput',
                    scope: this.id,
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_GAMMA_FACTOR
                }, {
                    xtype: 'number',
                    id: 'gammaFactor',
                    scope: this.id,
                }]
            }]
        }],
        buttons: [{
            xtype: 'button',
            text: L_SAVE,
            onClick: () => {
                this.save();
            }
        }, {
            xtype: 'button',
            text: L_CANCEL,
            onClick: () => {
                this.hide();
            }
        }]
    });
    this.window.render();
};

OptionsWindow.prototype.show = function () {
    this.window.show();

    var theme = UI.get('theme', this.id);
    var shadowMapType = UI.get('shadowMapType', this.id);
    var gammaInput = UI.get('gammaInput', this.id);
    var gammaOutput = UI.get('gammaOutput', this.id);
    var gammaFactor = UI.get('gammaFactor', this.id);

    if (!this.app.storage.get('theme')) {
        this.app.storage.set('theme', 'assets/css/light.css');
    }

    theme.setValue(this.app.storage.get('theme'));

    var renderer = this.app.editor.renderer;

    if (renderer.shadowMap.enabled) {
        shadowMapType.setValue(renderer.shadowMap.type);
    } else {
        shadowMapType.setValue(-1);
    }

    gammaInput.setValue(renderer.gammaInput);
    gammaOutput.setValue(renderer.gammaOutput);
    gammaFactor.setValue(renderer.gammaFactor);
};

OptionsWindow.prototype.hide = function () {
    this.window.hide();
};

OptionsWindow.prototype.changeTab = function (name) {
    if (name === L_SURFACE) {
        UI.get('surfaceTab', this.id).dom.classList.add('selected');
        UI.get('rendererTab', this.id).dom.classList.remove('selected');
        UI.get('surfacePanel', this.id).dom.style.display = '';
        UI.get('rendererPanel', this.id).dom.style.display = 'none';
    } else if (name === L_RENDERER) {
        UI.get('surfaceTab', this.id).dom.classList.remove('selected');
        UI.get('rendererTab', this.id).dom.classList.add('selected');
        UI.get('surfacePanel', this.id).dom.style.display = 'none';
        UI.get('rendererPanel', this.id).dom.style.display = '';
    }
};

OptionsWindow.prototype.save = function () {
    // 主题
    var theme = UI.get('theme', this.id).getValue();
    this.app.storage.set('theme', theme)
    document.getElementById('theme').href = theme;

    // 渲染器
    var shadowMapType = parseInt(UI.get('shadowMapType', this.id).getValue());
    var gammaInput = UI.get('gammaInput', this.id).getValue();
    var gammaOutput = UI.get('gammaOutput', this.id).getValue();
    var gammaFactor = UI.get('gammaFactor', this.id).getValue();

    var renderer = this.app.editor.renderer;

    if (shadowMapType === -1) {
        renderer.shadowMap.enabled = false;
    } else {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = shadowMapType;
    }
    renderer.gammaInput = gammaInput;
    renderer.gammaOutput = gammaOutput;
    renderer.gammaFactor = gammaFactor;

    renderer.dispose();

    // 隐藏窗口
    this.hide();
    UI.msg(L_SAVE_SUCCESS);
};

export default OptionsWindow;