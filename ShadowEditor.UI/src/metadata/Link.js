import { Control, UI } from '../third_party';

/**
 * Link
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Link(options = {}) {
    Control.call(this, options);
}

Link.prototype = Object.create(Control.prototype);
Link.prototype.constructor = Link;

Link.prototype.render = function () {
    this.renderDom(this.createElement('link'));
};

UI.addXType('link', Link);

export default Link;