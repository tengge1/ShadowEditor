import { Control, UI } from '../third_party';

/**
 * Img
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Img(options = {}) {
    Control.call(this, options);
}

Img.prototype = Object.create(Control.prototype);
Img.prototype.constructor = Img;

Img.prototype.render = function () {
    this.renderDom(this.createElement('img'));
};

UI.addXType('img', Img);

export default Img;