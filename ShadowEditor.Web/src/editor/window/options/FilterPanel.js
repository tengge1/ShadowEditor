import UI from '../../../ui/UI';

/**
 * 滤镜选项窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function FilterPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
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
                text: L_SATURATION
            }, {
                xtype: 'number',
                id: 'saturation', // 饱和度
                scope: this.id,
                range: [0, 2],
                value: 1,
                onChange: this.save.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_LIGHTNESS
            }, {
                xtype: 'number',
                id: 'lightness', // 饱和度
                scope: this.id,
                range: [0, 2],
                value: 1,
                onChange: this.save.bind(this)
            }]
        }]
    }).render();

    this.dom = UI.get('panel', this.id).dom;
};

FilterPanel.prototype.update = function () {
    var hue = UI.get('hue', this.id);
    var saturation = UI.get('saturation', this.id);
    var lightness = UI.get('lightness', this.id);

    var renderer = this.app.editor.renderer;
    var filters = this.parseFilter(renderer.domElement.style.filter);
    hue.setValue(filters['hue-rotate']);
    saturation.setValue(filters['saturate']);
    lightness.setValue(filters['brightness']);
};

FilterPanel.prototype.save = function () {
    var hue = UI.get('hue', this.id);
    var saturation = UI.get('saturation', this.id);
    var lightness = UI.get('lightness', this.id);

    var filters = {
        'hue-rotate': hue.getValue(),
        'saturate': saturation.getValue(),
        'brightness': lightness.getValue(),
    };

    var renderer = this.app.editor.renderer;

    renderer.domElement.style.filter = this.serializeFilter(filters);
};

FilterPanel.prototype.serializeFilter = function (filters) {
    return `hue-rotate(${filters['hue-rotate']}deg) saturate(${filters['saturate']}) brightness(${filters['brightness']})`;
};

FilterPanel.prototype.parseFilter = function (str) {
    var list = str.split(' ');

    var filters = {
        'hue-rotate': 0,
        'saturate': 1,
        'brightness': 1,
    };

    list.forEach(n => {
        if (n.startsWith('hue-rotate')) { // 色调
            filters['hue-rotate'] = n.substr(11, n.length - 4);
        } else if (n.startsWith('saturate')) { // 饱和度
            filters['saturate'] = n.substr(9, n.length - 1);
        } else if (n.startsWith('brightness')) { // 亮度
            filters['brightness'] = n.substr(11, n.length - 1);
        }
    });

    return filters;
};

export default FilterPanel;