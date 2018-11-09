import { Control, UI } from '../third_party';

/**
 * BlockQuote
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function BlockQuote(options = {}) {
    Control.call(this, options);
}

BlockQuote.prototype = Object.create(Control.prototype);
BlockQuote.prototype.constructor = BlockQuote;

BlockQuote.prototype.render = function () {
    this.renderDom(this.createElement('blockquote'));
};

UI.addXType('blockquote', BlockQuote);

export default BlockQuote;