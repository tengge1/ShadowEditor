import UI from '../ui/UI';

/**
 * 场景编辑区
 * @author mrdoob / http://mrdoob.com/
 */
function Viewport(app) {
    this.app = app;
    UI.Control.call(this, { parent: this.app.container });
};

Viewport.prototype = Object.create(UI.Control.prototype);
Viewport.prototype.constructor = Viewport;

Viewport.prototype.render = function () {
    this.container = UI.create({
        xtype: 'div',
        parent: this.app.container,
        id: 'viewport'
    });
    this.container.render();
};

export default Viewport;