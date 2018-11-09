import { Control, UI } from '../third_party';

/**
 * Source
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Source(options = {}) {
    Control.call(this, options);
}

Source.prototype = Object.create(Control.prototype);
Source.prototype.constructor = Source;

Source.prototype.render = function () {
    this.renderDom(this.createElement('source'));
};

UI.addXType('source', Source);

export default Source;