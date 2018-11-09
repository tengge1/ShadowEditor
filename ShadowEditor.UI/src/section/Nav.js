import { Control, UI } from '../third_party';

/**
 * Nav
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Nav(options = {}) {
    Control.call(this, options);
}

Nav.prototype = Object.create(Control.prototype);
Nav.prototype.constructor = Nav;

Nav.prototype.render = function () {
    this.renderDom(this.createElement('nav'));
};

UI.addXType('nav', Nav);

export default Nav;