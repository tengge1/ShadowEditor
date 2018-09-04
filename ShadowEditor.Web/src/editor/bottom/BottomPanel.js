import Control from '../../ui/Control';
import TimePanel from './TimePanel';

/**
 * 底部面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function BottomPanel(options) {
    Control.call(this, options);
    this.app = options.app;
};

BottomPanel.prototype = Object.create(Control.prototype);
BottomPanel.prototype.constructor = BottomPanel;

BottomPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        cls: 'sidebar bottomPanel',
        parent: this.app.container,
        children: [
            new TimePanel({
                app: this.app
            })
        ]
    };

    var control = UI.create(data);
    control.render();
};

export default BottomPanel;