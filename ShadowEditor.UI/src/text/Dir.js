import { Control, UI } from '../third_party';

/**
 * Dir
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Dir(options = {}) {
    Control.call(this, options);
}

Dir.prototype = Object.create(Control.prototype);
Dir.prototype.constructor = Dir;

Dir.prototype.render = function () {
    this.renderDom(this.createElement('dir'));
};

UI.addXType('dir', Dir);

export default Dir;