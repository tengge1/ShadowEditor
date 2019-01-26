import BaseComponent from '../BaseComponent';

/**
 * 像素特效组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function PixelComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

PixelComponent.prototype = Object.create(BaseComponent.prototype);
PixelComponent.prototype.constructor = PixelComponent;

PixelComponent.prototype.render = function () {
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
                text: L_PIXEL_EFFECT
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
                text: L_PIXEL_SIZE
            }, {
                xtype: 'int',
                id: 'pixelSize',
                scope: this.id,
                value: 8,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

PixelComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

PixelComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

PixelComponent.prototype.updateUI = function () {
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
    var pixelSize = UI.get('pixelSize', this.id);

    var scene = this.selected;
    var postProcessing = scene.userData.postProcessing || {};

    if (postProcessing.pixel) {
        enabled.setValue(postProcessing.pixel.enabled);
        pixelSize.setValue(postProcessing.pixel.pixelSize);
    }
};

PixelComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);
    var pixelSize = UI.get('pixelSize', this.id);

    var scene = this.selected;
    scene.userData.postProcessing = scene.userData.postProcessing || {};

    Object.assign(scene.userData.postProcessing, {
        pixel: {
            enabled: enabled.getValue(),
            pixelSize: pixelSize.getValue()
        },
    });

    this.app.call(`postProcessingChanged`, this);
};

export default PixelComponent;