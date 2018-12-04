import UI from '../../ui/UI';

/**
 * 材质面板
 * @author tengge / https://github.com/tengge1
 */
function MaterialPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

MaterialPanel.prototype = Object.create(UI.Control.prototype);
MaterialPanel.prototype.constructor = MaterialPanel;

MaterialPanel.prototype.render = function () {
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

export default MaterialPanel;