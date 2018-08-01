import UI from '../ui/UI';

/**
 * 场景编辑区
 * @author mrdoob / http://mrdoob.com/
 */
function Viewport(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

Viewport.prototype = Object.create(UI.Control.prototype);
Viewport.prototype.constructor = Viewport;

Viewport.prototype.render = function () {
    this.container = UI.create({
        xtype: 'div',
        id: 'viewport',
        parent: this.app.container,
        cls: 'viewport'
    });
    this.container.render();
};

export default Viewport;