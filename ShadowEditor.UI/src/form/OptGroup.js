import { Control, UI } from '../third_party';

/**
 * OptGroup
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function OptGroup(options = {}) {
    Control.call(this, options);
}

OptGroup.prototype = Object.create(Control.prototype);
OptGroup.prototype.constructor = OptGroup;

OptGroup.prototype.render = function () {
    this.renderDom(this.createElement('optgroup'));
};

UI.addXType('optgroup', OptGroup);

export default OptGroup;