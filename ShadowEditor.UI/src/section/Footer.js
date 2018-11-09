import { Control, UI } from '../third_party';

/**
 * Footer
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Footer(options = {}) {
    Control.call(this, options);
}

Footer.prototype = Object.create(Control.prototype);
Footer.prototype.constructor = Footer;

Footer.prototype.render = function () {
    this.renderDom(this.createElement('footer'));
};

UI.addXType('footer', Footer);

export default Footer;