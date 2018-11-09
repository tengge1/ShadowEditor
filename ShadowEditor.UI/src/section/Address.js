import { Control, UI } from '../third_party';

/**
 * Address
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Address(options = {}) {
    Control.call(this, options);
}

Address.prototype = Object.create(Control.prototype);
Address.prototype.constructor = Address;

Address.prototype.render = function () {
    this.renderDom(this.createElement('address'));
};

UI.addXType('address', Address);

export default Address;