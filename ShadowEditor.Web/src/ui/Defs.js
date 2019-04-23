import Control from './Control';
import UI from './Manager';

const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = "http://www.w3.org/1999/xlink";

/**
 * Defs
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Defs(options) {
    Control.call(this, options);
};

Defs.prototype = Object.create(Control.prototype);
Defs.prototype.constructor = Defs;

Defs.prototype.render = function () {
    this.dom = document.createElementNS(svgNS, 'defs');
    this.parent.appendChild(this.dom);
};

UI.addXType('defs', Defs);

export default Defs;