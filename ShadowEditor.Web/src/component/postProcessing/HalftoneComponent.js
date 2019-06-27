import BaseComponent from '../BaseComponent';

/**
 * 半色调特效组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function HalftoneComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

HalftoneComponent.prototype = Object.create(BaseComponent.prototype);
HalftoneComponent.prototype.constructor = HalftoneComponent;

HalftoneComponent.prototype.render = function () {
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
                text: L_HALFTONE_EFFECT
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
                text: L_SHAPE
            }, {
                xtype: 'select',
                id: 'shape',
                scope: this.id,
                options: {
                    1: L_POINT,
                    2: L_ELLIPSE,
                    3: L_LINE,
                    4: L_SQUARE
                },
                value: 1,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_RADIUS
            }, {
                xtype: 'number',
                id: 'radius',
                scope: this.id,
                range: [1, 25],
                value: 4,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ROTATE_RED
            }, {
                xtype: 'number',
                id: 'rotateR',
                scope: this.id,
                value: 15,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ROTATE_GREEN
            }, {
                xtype: 'number',
                id: 'rotateG',
                scope: this.id,
                value: 45,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_ROTATE_BLUE
            }, {
                xtype: 'number',
                id: 'rotateB',
                scope: this.id,
                value: 30,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_SCATTER
            }, {
                xtype: 'number',
                id: 'scatter',
                scope: this.id,
                value: 0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BLENDING
            }, {
                xtype: 'number',
                id: 'blending',
                scope: this.id,
                range: [0, 1],
                value: 1,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BLENDING_MODE
            }, {
                xtype: 'select',
                id: 'blendingMode',
                scope: this.id,
                options: {
                    1: L_LINEAR,
                    2: L_MULTIPLY,
                    3: L_ADD,
                    4: L_LIGHTER,
                    5: L_DARKER
                },
                value: 1,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_GREY_SCALE
            }, {
                xtype: 'checkbox',
                id: 'greyscale',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

HalftoneComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

HalftoneComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

HalftoneComponent.prototype.updateUI = function () {
    var container = UI.get('panel', this.id);
    var editor = app.editor;
    if (editor.selected && editor.selected === editor.scene) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var enabled = UI.get('enabled', this.id);
    var shape = UI.get('shape', this.id);
    var radius = UI.get('radius', this.id);
    var rotateR = UI.get('rotateR', this.id);
    var rotateB = UI.get('rotateB', this.id);
    var rotateG = UI.get('rotateG', this.id);
    var scatter = UI.get('scatter', this.id);
    var blending = UI.get('blending', this.id);
    var blendingMode = UI.get('blendingMode', this.id);
    var greyscale = UI.get('greyscale', this.id);

    var scene = this.selected;
    var postProcessing = scene.userData.postProcessing || {};

    if (postProcessing.halftone) {
        enabled.setValue(postProcessing.halftone.enabled);
        shape.setValue(postProcessing.halftone.shape);
        radius.setValue(postProcessing.halftone.radius);
        rotateR.setValue(postProcessing.halftone.rotateR);
        rotateB.setValue(postProcessing.halftone.rotateB);
        rotateG.setValue(postProcessing.halftone.rotateG);
        scatter.setValue(postProcessing.halftone.scatter);
        blending.setValue(postProcessing.halftone.blending);
        blendingMode.setValue(postProcessing.halftone.blendingMode);
        greyscale.setValue(postProcessing.halftone.greyscale);
    }
};

HalftoneComponent.prototype.onChange = function () {
    var enabled = UI.get('enabled', this.id);
    var shape = UI.get('shape', this.id);
    var radius = UI.get('radius', this.id);
    var rotateR = UI.get('rotateR', this.id);
    var rotateB = UI.get('rotateB', this.id);
    var rotateG = UI.get('rotateG', this.id);
    var scatter = UI.get('scatter', this.id);
    var blending = UI.get('blending', this.id);
    var blendingMode = UI.get('blendingMode', this.id);
    var greyscale = UI.get('greyscale', this.id);

    var scene = this.selected;
    scene.userData.postProcessing = scene.userData.postProcessing || {};

    Object.assign(scene.userData.postProcessing, {
        halftone: {
            enabled: enabled.getValue(),
            shape: shape.getValue(),
            radius: radius.getValue(),
            rotateR: rotateR.getValue(),
            rotateB: rotateB.getValue(),
            rotateG: rotateG.getValue(),
            scatter: scatter.getValue(),
            blending: blending.getValue(),
            blendingMode: blendingMode.getValue(),
            greyscale: greyscale.getValue()
        },
    });

    app.call(`postProcessingChanged`, this);
};

export default HalftoneComponent;