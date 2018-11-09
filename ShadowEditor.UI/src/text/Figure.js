import { Control, UI } from '../third_party';

/**
 * Figure
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Figure(options = {}) {
    Control.call(this, options);
}

Figure.prototype = Object.create(Control.prototype);
Figure.prototype.constructor = Figure;

Figure.prototype.render = function () {
    this.renderDom(this.createElement('figure'));
};

UI.addXType('figure', Figure);

export default Figure;