import UI from '../../ui/UI';

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
                text: '外观',
                cls: 'selected',
                onClick: () => {
                    this.changeTab('外观');
                }
            }, {
                xtype: 'text',
                id: 'rendererTab',
                text: '渲染器',
                onClick: () => {
                    this.changeTab('渲染器');
                }
            }]
        }, {
            xtype: 'div',
            id: 'surfacePanel',
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
            id: 'rendererPanel',
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
        UI.get('surfaceTab').dom.classList.add('selected');
        UI.get('rendererTab').dom.classList.remove('selected');
        UI.get('surfacePanel').dom.style.display = '';
        UI.get('rendererPanel').dom.style.display = 'none';
    } else if (name === '渲染器') {
        UI.get('surfaceTab').dom.classList.remove('selected');
        UI.get('rendererTab').dom.classList.add('selected');
        UI.get('surfacePanel').dom.style.display = 'none';
        UI.get('rendererPanel').dom.style.display = '';
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

    if (shadowMapType === -1) {
        renderer.shadowMap.enabled = false;
    } else {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = shadowMapType;
    }
    renderer.gammaInput = gammaInput;
    renderer.gammaOutput = gammaOutput;
    renderer.gammaFactor = gammaFactor;

    // 隐藏窗口
    this.hide();
    UI.msg('保存成功。');
};

export default OptionsWindow;