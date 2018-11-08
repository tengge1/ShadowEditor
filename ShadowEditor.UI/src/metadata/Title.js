import { Control, UI } from '../third_party';

/**
 * Title
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Title(options = {}) {
    Control.call(this, options);
}

Title.prototype = Object.create(Control.prototype);
Title.prototype.constructor = Title;

Title.prototype.render = function () {
    this.renderDom(this.createElement('title'));
};

UI.addXType('title', Title);

export default Title;