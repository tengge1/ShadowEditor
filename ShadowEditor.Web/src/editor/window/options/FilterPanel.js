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
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_SATURATION
            }, {
                xtype: 'number',
                id: 'saturation', // 饱和度
                range: [0, 2],
                value: 1,
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_LIGHTNESS
            }, {
                xtype: 'number',
                id: 'lightness', // 饱和度
                range: [0, 2],
                value: 1,
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
};

FilterPanel.prototype.save = function () {
    var hue = UI.get('hue', this.id);
    var saturation = UI.get('saturation', this.id);
    var lightness = UI.get('lightness', this.id);
};

export default FilterPanel;