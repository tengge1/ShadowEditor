import { Control, UI } from '../third_party';

/**
 * Aside
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Aside(options = {}) {
    Control.call(this, options);
}

Aside.prototype = Object.create(Control.prototype);
Aside.prototype.constructor = Aside;

Aside.prototype.render = function () {
    this.renderDom(this.createElement('aside'));
};

UI.addXType('aside', Aside);

export default Aside;