import { Control, UI } from '../third_party';

/**
 * Br
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Br(options = {}) {
    Control.call(this, options);
}

Br.prototype = Object.create(Control.prototype);
Br.prototype.constructor = Br;

Br.prototype.render = function () {
    this.renderDom(this.createElement('br'));
};

UI.addXType('br', Br);

export default Br;