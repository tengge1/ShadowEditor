import { Control, UI } from '../third_party';

/**
 * Caption
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Caption(options = {}) {
    Control.call(this, options);
}

Caption.prototype = Object.create(Control.prototype);
Caption.prototype.constructor = Caption;

Caption.prototype.render = function () {
    this.renderDom(this.createElement('caption'));
};

UI.addXType('caption', Caption);

export default Caption;