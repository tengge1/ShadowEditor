import { Control, UI } from '../third_party';

/**
 * Style
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Style(options = {}) {
    Control.call(this, options);
}

Style.prototype = Object.create(Control.prototype);
Style.prototype.constructor = Style;

Style.prototype.render = function () {
    this.renderDom(this.createElement('style'));
};

UI.addXType('style', Style);

export default Style;