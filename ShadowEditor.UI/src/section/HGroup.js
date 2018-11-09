import { Control, UI } from '../third_party';

/**
 * HGroup
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function HGroup(options = {}) {
    Control.call(this, options);
}

HGroup.prototype = Object.create(Control.prototype);
HGroup.prototype.constructor = HGroup;

HGroup.prototype.render = function () {
    this.renderDom(this.createElement('hgroup'));
};

UI.addXType('hgroup', HGroup);

export default HGroup;