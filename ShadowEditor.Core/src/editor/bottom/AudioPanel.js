import { UI } from '../../third_party';

/**
 * 纹理面板
 * @author tengge / https://github.com/tengge1
 */
function AudioPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

AudioPanel.prototype = Object.create(UI.Control.prototype);
AudioPanel.prototype.constructor = AudioPanel;

AudioPanel.prototype.render = function () {
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

export default AudioPanel;