import { UI } from '../../third_party';

/**
 * 粒子面板
 * @author tengge / https://github.com/tengge1
 */
function ParticlePanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

ParticlePanel.prototype = Object.create(UI.Control.prototype);
ParticlePanel.prototype.constructor = ParticlePanel;

ParticlePanel.prototype.render = function () {
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

export default ParticlePanel;