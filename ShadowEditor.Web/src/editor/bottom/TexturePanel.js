import UI from '../../ui/UI';

/**
 * 纹理面板
 * @author tengge / https://github.com/tengge1
 */
function TexturePanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

TexturePanel.prototype = Object.create(UI.Control.prototype);
TexturePanel.prototype.constructor = TexturePanel;

TexturePanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'Panel',
        style: {
            position: 'relative'
        },
        children: []
    };

    var control = UI.create(data);
    control.render();
};

export default TexturePanel;