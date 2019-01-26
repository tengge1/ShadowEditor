import BaseComponent from '../BaseComponent';

/**
 * 可扩展环境光遮挡(SAO)组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SaoComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

SaoComponent.prototype = Object.create(BaseComponent.prototype);
SaoComponent.prototype.constructor = SaoComponent;

SaoComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'panel',
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
                    fontWeight: 'bold',
                    width: '100%'
                },
                text: L_SAO
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ENABLE_STATE
            }, {
                xtype: 'checkbox',
                id: 'enabled',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_OUTPUT
            }, {
                xtype: 'select',
                id: 'output',
                scope: this.id,
                options: {
                    [THREE.SAOPass.OUTPUT.Beauty]: L_BEAUTY,
                    [THREE.SAOPass.OUTPUT.Default]: L_BEAUTY_AND_OCCLUSION,
                    [THREE.SAOPass.OUTPUT.SAO]: L_OCCLUSION,
                    [THREE.SAOPass.OUTPUT.Depth]: L_DEPTH,
                    [THREE.SAOPass.OUTPUT.Normal]: L_NORMAL
                },
                value: THREE.SAOPass.OUTPUT.Default,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BIAS
            }, {
                xtype: 'number',
                id: 'saoBias',
                scope: this.id,
                range: [-1, 1],
                value: 0.5,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_INTENSITY
            }, {
                xtype: 'number',
                id: 'saoIntensity',
                scope: this.id,
                range: [0, 1],
                value: 0.02,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_SCALE
            }, {
                xtype: 'number',
                id: 'saoScale',
                scope: this.id,
                range: [0, 500],
                value: 100,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_KERNAL_RADIUS
            }, {
                xtype: 'number',
                id: 'saoKernelRadius',
                scope: this.id,
                range: [1, 100],
                value: 50,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MIN_RESOLUTION
            }, {
                xtype: 'number',
                id: 'saoMinResolution',
                scope: this.id,
                range: [0, 1],
                value: 0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BLUR
            }, {
                xtype: 'checkbox',
                id: 'saoBlur',
                scope: this.id,
                value: true,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BLUR_RADIUS
            }, {
                xtype: 'number',
                id: 'saoBlurRadius',
                scope: this.id,
                range: [0, 200],
                value: 16,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BLUR_STD_DEV
            }, {
                xtype: 'number',
                id: 'saoBlurStdDev',
                scope: this.id,
                range: [0.5, 150],
                value: 32.6,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BLUR_DEPTH_CUTOFF
            }, {
                xtype: 'number',
                id: 'saoBlurDepthCutoff',
                scope: this.id,
                range: [0.0, 0.1],
                value: 0.046,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

SaoComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

SaoComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

SaoComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof THREE.Scene) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var enabled = UI.get('enabled', this.id);
    var output = UI.get('output', this.id);
    var saoBias = UI.get('saoBias', this.id);
    var saoIntensity = UI.get('saoIntensity', this.id);
    var saoScale = UI.get('saoScale', this.id);
    var saoKernelRadius = UI.get('saoKernelRadius', this.id);
    var saoMinResolution = UI.get('saoMinResolution', this.id);
    var saoBlur = UI.get('saoBlur', this.id);
    var saoBlurRadius = UI.get('saoBlurRadius', this.id);
    var saoBlurStdDev = UI.get('saoBlurStdDev', this.id);
    var saoBlurDepthCutoff = UI.get('saoBlurDepthCutoff', this.id);

    var scene = this.selected;
    var postProcessing = scene.userData.postProcessing || {};

    if (postProcessing.sao) {
        enabled.setValue(postProcessing.sao.enabled);
        output.setValue(postProcessing.sao.output.toString());
        saoBias.setValue(postProcessing.sao.saoBias);
        saoIntensity.setValue(postProcessing.sao.saoIntensity);
        saoScale.setValue(postProcessing.sao.saoScale);
        saoKernelRadius.setValue(postProcessing.sao.saoKernelRadius);
        saoMinResolution.setValue(postProcessing.sao.saoMinResolution);
        saoBlur.setValue(postProcessing.sao.saoBlur);
        saoBlurRadius.setValue(postProcessing.sao.saoBlurRadius);
        saoBlurStdDev.setValue(postProcessing.sao.saoBlurStdDev);
        saoBlurDepthCutoff.setValue(postProcessing.sao.saoBlurDepthCutoff);
    }
};

SaoComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);
    var output = UI.get('output', this.id);
    var saoBias = UI.get('saoBias', this.id);
    var saoIntensity = UI.get('saoIntensity', this.id);
    var saoScale = UI.get('saoScale', this.id);
    var saoKernelRadius = UI.get('saoKernelRadius', this.id);
    var saoMinResolution = UI.get('saoMinResolution', this.id);
    var saoBlur = UI.get('saoBlur', this.id);
    var saoBlurRadius = UI.get('saoBlurRadius', this.id);
    var saoBlurStdDev = UI.get('saoBlurStdDev', this.id);
    var saoBlurDepthCutoff = UI.get('saoBlurDepthCutoff', this.id);

    var scene = this.selected;
    scene.userData.postProcessing = scene.userData.postProcessing || {};

    Object.assign(scene.userData.postProcessing, {
        sao: {
            enabled: enabled.getValue(),
            output: parseInt(output.getValue()),
            saoBias: saoBias.getValue(),
            saoIntensity: saoIntensity.getValue(),
            saoScale: saoScale.getValue(),
            saoKernelRadius: saoKernelRadius.getValue(),
            saoMinResolution: saoMinResolution.getValue(),
            saoBlur: saoBlur.getValue(),
            saoBlurRadius: saoBlurRadius.getValue(),
            saoBlurStdDev: saoBlurStdDev.getValue(),
            saoBlurDepthCutoff: saoBlurDepthCutoff.getValue(),
        },
    });

    this.app.call(`postProcessingChanged`, this);
};

export default SaoComponent;