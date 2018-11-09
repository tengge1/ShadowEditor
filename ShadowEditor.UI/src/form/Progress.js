import { Control, UI } from '../third_party';

/**
 * Progress
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Progress(options = {}) {
    Control.call(this, options);
}

Progress.prototype = Object.create(Control.prototype);
Progress.prototype.constructor = Progress;

Progress.prototype.render = function () {
    this.renderDom(this.createElement('progress'));
};

UI.addXType('progress', Progress);

export default Progress;