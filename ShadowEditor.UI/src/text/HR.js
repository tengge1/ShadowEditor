import { Control, UI } from '../third_party';

/**
 * HR
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function HR(options = {}) {
    Control.call(this, options);
}

HR.prototype = Object.create(Control.prototype);
HR.prototype.constructor = HR;

HR.prototype.render = function () {
    this.renderDom(this.createElement('hr'));
};

UI.addXType('hr', HR);

export default HR;