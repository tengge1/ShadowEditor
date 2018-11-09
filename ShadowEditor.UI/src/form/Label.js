import { Control, UI } from '../third_party';

/**
 * Label
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Label(options = {}) {
    Control.call(this, options);
}

Label.prototype = Object.create(Control.prototype);
Label.prototype.constructor = Label;

Label.prototype.render = function () {
    this.renderDom(this.createElement('label'));
};

UI.addXType('label', Label);

export default Label;