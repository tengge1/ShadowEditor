import { Control, UI } from '../third_party';

/**
 * Canvas
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Canvas(options = {}) {
    Control.call(this, options);
}

Canvas.prototype = Object.create(Control.prototype);
Canvas.prototype.constructor = Canvas;

Canvas.prototype.render = function () {
    this.renderDom(this.createElement('canvas'));
};

UI.addXType('canvas', Canvas);

export default Canvas;