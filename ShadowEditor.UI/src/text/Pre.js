import { Control, UI } from '../third_party';

/**
 * Pre
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Pre(options = {}) {
    Control.call(this, options);
}

Pre.prototype = Object.create(Control.prototype);
Pre.prototype.constructor = Pre;

Pre.prototype.render = function () {
    this.renderDom(this.createElement('pre'));
};

UI.addXType('pre', Pre);

export default Pre;