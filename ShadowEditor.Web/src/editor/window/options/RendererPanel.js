import UI from '../../../ui/UI';

/**
 * 渲染器选项窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function RendererPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

RendererPanel.prototype = Object.create(UI.Control.prototype);
RendererPanel.prototype.constructor = RendererPanel;

RendererPanel.prototype.render = function () {
    UI.create({
        xtype: 'div',
        id: 'panel',
        scope: this.id,
        parent: this.parent,
        style: this.style,
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
                },
                onChange: this.save.bind(this),
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
                onChange: this.save.bind(this),
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
                onChange: this.save.bind(this),
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
                onChange: this.save.bind(this),
            }]
        }]
    }).render();

    this.dom = UI.get('panel', this.id).dom;
};

RendererPanel.prototype.update = function () {
    var shadowMapType = UI.get('shadowMapType', this.id);
    var gammaInput = UI.get('gammaInput', this.id);
    var gammaOutput = UI.get('gammaOutput', this.id);
    var gammaFactor = UI.get('gammaFactor', this.id);

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

RendererPanel.prototype.save = function () {
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
};

export default RendererPanel;