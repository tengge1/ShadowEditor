import Control from '../ui/Control';
import XType from '../ui/XType';

/**
 * 场景编辑区
 * @author mrdoob / http://mrdoob.com/
 */
function Viewport(app) {
    this.app = app;
    Control.call(this, { parent: this.app.container });
};

Viewport.prototype = Object.create(Control.prototype);
Viewport.prototype.constructor = Viewport;

Viewport.prototype.render = function () {
    this.container = XType.create({
        xtype: 'div',
        parent: this.app.container,
        id: 'viewport'
    });
    this.container.render();
};

export default Viewport;