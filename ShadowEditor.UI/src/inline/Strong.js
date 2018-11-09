import { Control, UI } from '../third_party';

/**
 * Strong
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Strong(options = {}) {
    Control.call(this, options);
}

Strong.prototype = Object.create(Control.prototype);
Strong.prototype.constructor = Strong;

Strong.prototype.render = function () {
    this.renderDom(this.createElement('strong'));
};

UI.addXType('strong', Strong);

export default Strong;