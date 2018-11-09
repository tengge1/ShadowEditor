import { Control, UI } from '../third_party';

/**
 * I
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function I(options = {}) {
    Control.call(this, options);
}

I.prototype = Object.create(Control.prototype);
I.prototype.constructor = I;

I.prototype.render = function () {
    this.renderDom(this.createElement('i'));
};

UI.addXType('i', I);

export default I;