import UI from '../../ui/UI';
import WebGLRendererSerializer from '../../serialization/core/WebGLRendererSerializer';

/**
 * 选项窗口
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
    var renderer = app.editor.renderer;
    var shadowMap = renderer.shadowMap;

    this.window = UI.create({
        xtype: 'window',
        parent: this.app.container,
        title: '选项窗口',
        width: '700px',
        height: '500px',
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
        }, {
            xtype: 'div',
            id: 'surfacePanel',
            scope: this.id,
            cls: 'TabPanel',
            children: [{
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '主题'
                }, { // class
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
        }, {
            xtype: 'div',
            id: 'scenePanel',
            scope: this.id,
            cls: 'TabPanel',
            style: {
                display: 'none'
            },
            children: []
        }, {
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
    UI.msg('保存成功。');
};

export default OptionsWindow;