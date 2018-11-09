import { Control, UI } from '../third_party';

/**
 * Script
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Script(options = {}) {
    Control.call(this, options);
}

Script.prototype = Object.create(Control.prototype);
Script.prototype.constructor = Script;

Script.prototype.render = function () {
    this.renderDom(this.createElement('script'));
};

UI.addXType('script', Script);

export default Script;