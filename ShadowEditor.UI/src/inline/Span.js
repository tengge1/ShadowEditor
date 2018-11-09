import { Control, UI } from '../third_party';

/**
 * Span
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Span(options = {}) {
    Control.call(this, options);
}

Span.prototype = Object.create(Control.prototype);
Span.prototype.constructor = Span;

Span.prototype.render = function () {
    this.renderDom(this.createElement('span'));
};

UI.addXType('span', Span);

export default Span;