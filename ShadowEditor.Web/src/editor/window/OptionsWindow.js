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
                    options: {
                        'assets/css/light.css': L_LIGHT_COLOR,
                        'assets/css/dark.css': L_DARK_COLOR
                    },
                    value: app.options.theme,
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
                    options: {
                        [-1]: L_DISABLED,
                        [THREE.BasicShadowMap]: L_BASIC_SHADOW, // 0
                        [THREE.PCFShadowMap]: L_PCF_SHADOW, // 1
                        [THREE.PCFSoftShadowMap]: L_PCF_SOFT_SHADOW // 2
                    },
                    value: shadowMap.enabled === false ? -1 : shadowMap.type
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_GAMMA_INPUT
                }, {
                    xtype: 'boolean',
                    id: 'gammaInput',
                    value: renderer.gammaInput
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_GAMMA_OUTPUT
                }, {
                    xtype: 'boolean',
                    id: 'gammaOutput',
                    value: renderer.gammaOutput
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: L_GAMMA_FACTOR
                }, {
                    xtype: 'number',
                    id: 'gammaFactor',
                    value: renderer.gammaFactor
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
    var theme = UI.get('theme').getValue();
    this.app.options.theme = theme;
    document.getElementById('theme').href = theme;

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
    UI.msg(L_SAVE_SUCCESS);
};

export default OptionsWindow;