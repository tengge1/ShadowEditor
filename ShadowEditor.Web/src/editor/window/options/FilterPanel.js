import UI from '../../../ui/UI';
import CssUtils from '../../../utils/CssUtils';

/**
 * 滤镜选项窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function FilterPanel(options) {
    UI.Control.call(this, options);
}

FilterPanel.prototype = Object.create(UI.Control.prototype);
FilterPanel.prototype.constructor = FilterPanel;

FilterPanel.prototype.render = function () {
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
                text: L_HUE
            }, {
                xtype: 'int',
                id: 'hue',
                scope: this.id,
                range: [0, 360],
                step: 10,
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_SATURATE
            }, {
                xtype: 'number',
                id: 'saturate',
                scope: this.id,
                range: [0, 4],
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BRIGHTNESS
            }, {
                xtype: 'number',
                id: 'brightness',
                scope: this.id,
                range: [0, 4],
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_BLUR
            }, {
                xtype: 'number',
                id: 'blur',
                scope: this.id,
                range: [0, 20],
                step: 1,
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_CONTRAST
            }, {
                xtype: 'number',
                id: 'contrast',
                scope: this.id,
                range: [0, 4],
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_GRAYSCALE
            }, {
                xtype: 'number',
                id: 'grayscale',
                scope: this.id,
                range: [0, 1],
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_INVERT
            }, {
                xtype: 'number',
                id: 'invert',
                scope: this.id,
                range: [0, 1],
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_SEPIA
            }, {
                xtype: 'number',
                id: 'sepia',
                scope: this.id,
                range: [0, 1],
                onChange: this.save.bind(this)
            }]
        }]
    }).render();

    this.dom = UI.get('panel', this.id).dom;
};

FilterPanel.prototype.update = function () {
    var hue = UI.get('hue', this.id);
    var saturate = UI.get('saturate', this.id);
    var brightness = UI.get('brightness', this.id);
    var blur = UI.get('blur', this.id);
    var contrast = UI.get('contrast', this.id);
    var grayscale = UI.get('grayscale', this.id);
    var invert = UI.get('invert', this.id);
    var sepia = UI.get('sepia', this.id);

    var renderer = app.editor.renderer;
    var filters = CssUtils.parseFilter(renderer.domElement.style.filter);
    hue.setValue(filters.hueRotate);
    saturate.setValue(filters.saturate);
    brightness.setValue(filters.brightness);
    blur.setValue(filters.blur);
    contrast.setValue(filters.contrast);
    grayscale.setValue(filters.grayscale);
    invert.setValue(filters.invert);
    sepia.setValue(filters.sepia);
};

FilterPanel.prototype.save = function () {
    var hue = UI.get('hue', this.id);
    var saturate = UI.get('saturate', this.id);
    var brightness = UI.get('brightness', this.id);
    var blur = UI.get('blur', this.id);
    var contrast = UI.get('contrast', this.id);
    var grayscale = UI.get('grayscale', this.id);
    var invert = UI.get('invert', this.id);
    var sepia = UI.get('sepia', this.id);

    var filters = {
        hueRotate: hue.getValue(),
        saturate: saturate.getValue(),
        brightness: brightness.getValue(),
        blur: blur.getValue(),
        contrast: contrast.getValue(),
        grayscale: grayscale.getValue(),
        invert: invert.getValue(),
        sepia: sepia.getValue(),
    };

    Object.assign(app.options, {
        hueRotate: filters.hueRotate,
        saturate: filters.saturate,
        brightness: filters.brightness,
        blur: filters.blur,
        contrast: filters.contrast,
        grayscale: filters.grayscale,
        invert: filters.invert,
        sepia: filters.sepia,
    });

    var renderer = app.editor.renderer;

    renderer.domElement.style.filter = CssUtils.serializeFilter(filters);
};

export default FilterPanel;