import { Control, UI } from '../third_party';

/**
 * Header
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Header(options = {}) {
    Control.call(this, options);
}

Header.prototype = Object.create(Control.prototype);
Header.prototype.constructor = Header;

Header.prototype.render = function () {
    this.renderDom(this.createElement('header'));
};

UI.addXType('header', Header);

export default Header;