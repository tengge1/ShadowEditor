import { Control, UI } from '../third_party';

/**
 * Div
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Div(options = {}) {
    Control.call(this, options);
}

Div.prototype = Object.create(Control.prototype);
Div.prototype.constructor = Div;

Div.prototype.render = function () {
    this.renderDom(this.createElement('div'));
};

UI.addXType('div', Div);

export default Div;