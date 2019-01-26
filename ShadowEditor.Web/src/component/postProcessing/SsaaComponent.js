import BaseComponent from '../BaseComponent';

/**
 * 全屏抗锯齿(SSAA)组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SsaaComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

SsaaComponent.prototype = Object.create(BaseComponent.prototype);
SsaaComponent.prototype.constructor = SsaaComponent;

SsaaComponent.prototype.render = function () {
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
                text: L_SSAA
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
                text: '等级'
            }, {
                xtype: 'select',
                id: 'sampleLevel',
                scope: this.id,
                options: {
                    0: L_ONE_SAMPLE,
                    1: L_TWO_SAMPLES,
                    2: L_FOUR_SAMPLES,
                    3: L_EIGHT_SAMPLES,
                    4: L_SIXTEEN_SAMPLES,
                    5: L_THIRTYTWO_SAMPLES
                },
                value: '3',
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_UNBIASED
            }, {
                xtype: 'checkbox',
                id: 'unbiased',
                scope: this.id,
                value: true,
                onChange: this.onChange.bind(this)
            }]
        },]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

SsaaComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

SsaaComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

SsaaComponent.prototype.updateUI = function () {
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
    var sampleLevel = UI.get('sampleLevel', this.id);
    var unbiased = UI.get('unbiased', this.id);

    var scene = this.selected;
    var postProcessing = scene.userData.postProcessing || {};

    if (postProcessing.ssaa) {
        enabled.setValue(postProcessing.ssaa.enabled);
        sampleLevel.setValue(postProcessing.ssaa.sampleLevel);
        unbiased.setValue(postProcessing.ssaa.unbiased);
    }
};

SsaaComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);
    var sampleLevel = UI.get('sampleLevel', this.id);
    var unbiased = UI.get('unbiased', this.id);

    var scene = this.selected;
    scene.userData.postProcessing = scene.userData.postProcessing || {};

    Object.assign(scene.userData.postProcessing, {
        ssaa: {
            enabled: enabled.getValue(),
            sampleLevel: parseInt(sampleLevel.getValue()),
            unbiased: unbiased.getValue(),
        },
    });

    this.app.call(`postProcessingChanged`, this);
};

export default SsaaComponent;