import { UI } from '../../third_party';

/**
 * 模型面板
 * @author tengge / https://github.com/tengge1
 */
function ModelPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

ModelPanel.prototype = Object.create(UI.Control.prototype);
ModelPanel.prototype.constructor = ModelPanel;

ModelPanel.prototype.render = function () {
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

export default ModelPanel;