import Control from './Control';

/**
 * Div
 * @param {*} options 
 */
function Div(options) {
    Control.call(this, options);
};

Div.prototype = Object.create(Control.prototype);
Div.prototype.constructor = Div;

Div.prototype.render = function () {
    this.dom = document.createElement('div');
    this.parent.appendChild(this.dom);
};

export default Div;