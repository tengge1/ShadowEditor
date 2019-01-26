import BaseComponent from '../BaseComponent';

/**
 * 屏幕空间环境光遮蔽(SSAO)组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SsaoComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

SsaoComponent.prototype = Object.create(BaseComponent.prototype);
SsaoComponent.prototype.constructor = SsaoComponent;

SsaoComponent.prototype.render = function () {
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
                text: L_SSAO
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
                    [THREE.SSAOPass.OUTPUT.Default]: L_DEFAULT,
                    [THREE.SSAOPass.OUTPUT.SSAO]: L_OCCLUSION,
                    [THREE.SSAOPass.OUTPUT.Blur]: L_OCCLUSION_AND_BLUR,
                    [THREE.SSAOPass.OUTPUT.Beauty]: L_BEAUTY,
                    [THREE.SSAOPass.OUTPUT.Depth]: L_DEPTH,
                    [THREE.SSAOPass.OUTPUT.Normal]: L_NORMAL
                },
                value: THREE.SSAOPass.OUTPUT.Default,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_KERNAL_RADIUS
            }, {
                xtype: 'number',
                id: 'kernelRadius',
                scope: this.id,
                range: [0, 32],
                value: 10,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MIN_DISTANCE
            }, {
                xtype: 'number',
                id: 'minDistance',
                scope: this.id,
                range: [0.001, 0.02],
                value: 0.001,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_MAX_DISTANCE
            }, {
                xtype: 'number',
                id: 'maxDistance',
                scope: this.id,
                range: [0.01, 0.3],
                value: 0.1,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

SsaoComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

SsaoComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

SsaoComponent.prototype.updateUI = function () {
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
    var kernelRadius = UI.get('kernelRadius', this.id);
    var minDistance = UI.get('minDistance', this.id);
    var maxDistance = UI.get('maxDistance', this.id);

    var scene = this.selected;
    var postProcessing = scene.userData.postProcessing || {};

    if (postProcessing.ssao) {
        enabled.setValue(postProcessing.ssao.enabled);
        output.setValue(postProcessing.ssao.output.toString());
        kernelRadius.setValue(postProcessing.ssao.kernelRadius);
        minDistance.setValue(postProcessing.ssao.minDistance);
        maxDistance.setValue(postProcessing.ssao.maxDistance);
    }
};

SsaoComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);
    var output = UI.get('output', this.id);
    var kernelRadius = UI.get('kernelRadius', this.id);
    var minDistance = UI.get('minDistance', this.id);
    var maxDistance = UI.get('maxDistance', this.id);

    var scene = this.selected;
    scene.userData.postProcessing = scene.userData.postProcessing || {};

    Object.assign(scene.userData.postProcessing, {
        ssao: {
            enabled: enabled.getValue(),
            output: parseInt(output.getValue()),
            kernelRadius: kernelRadius.getValue(),
            minDistance: minDistance.getValue(),
            maxDistance: maxDistance.getValue()
        },
    });

    this.app.call(`postProcessingChanged`, this);
};

export default SsaoComponent;