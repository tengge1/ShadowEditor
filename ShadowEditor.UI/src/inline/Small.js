import { Control, UI } from '../third_party';

/**
 * Small
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Small(options = {}) {
    Control.call(this, options);
}

Small.prototype = Object.create(Control.prototype);
Small.prototype.constructor = Small;

Small.prototype.render = function () {
    this.renderDom(this.createElement('small'));
};

UI.addXType('small', Small);

export default Small;