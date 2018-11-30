import UI from '../../ui/UI';

/**
 * 贴图面板
 * @author tengge / https://github.com/tengge1
 */
function MapPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

MapPanel.prototype = Object.create(UI.Control.prototype);
MapPanel.prototype.constructor = MapPanel;

MapPanel.prototype.render = function () {
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

export default MapPanel;