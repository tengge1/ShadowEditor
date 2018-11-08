import { Control, UI } from '../third_party';

/**
 * Head
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Head(options = {}) {
    Control.call(this, options);
}

Head.prototype = Object.create(Control.prototype);
Head.prototype.constructor = Head;

Head.prototype.render = function () {
    this.renderDom(this.createElement('head'));
};

UI.addXType('head', Head);

export default Head;