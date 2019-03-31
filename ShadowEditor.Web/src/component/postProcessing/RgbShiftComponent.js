import BaseComponent from '../BaseComponent';

/**
 * 颜色偏移组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function RgbShiftComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

RgbShiftComponent.prototype = Object.create(BaseComponent.prototype);
RgbShiftComponent.prototype.constructor = RgbShiftComponent;

RgbShiftComponent.prototype.render = function () {
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
                text: L_RGB_SHIFT_EFFECT
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
                text: L_AMOUNT
            }, {
                xtype: 'number',
                id: 'amount',
                scope: this.id,
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

RgbShiftComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

RgbShiftComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

RgbShiftComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected === editor.scene) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var enabled = UI.get('enabled', this.id);
    var amount = UI.get('amount', this.id);

    var scene = this.selected;
    var postProcessing = scene.userData.postProcessing || {};

    if (postProcessing.rgbShift) {
        enabled.setValue(postProcessing.rgbShift.enabled);
        amount.setValue(postProcessing.rgbShift.amount);
    }
};

RgbShiftComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);
    var amount = UI.get('amount', this.id);

    var scene = this.selected;
    scene.userData.postProcessing = scene.userData.postProcessing || {};

    Object.assign(scene.userData.postProcessing, {
        rgbShift: {
            enabled: enabled.getValue(),
            amount: amount.getValue()
        },
    });

    this.app.call(`postProcessingChanged`, this);
};

export default RgbShiftComponent;