import Control from './Control';

/**
 * 水平线
 * @param {*} options 
 */
function HorizontalRule(options) {
    Control.call(this, options);
};

HorizontalRule.prototype = Object.create(Control.prototype);
HorizontalRule.prototype.constructor = HorizontalRule;

HorizontalRule.prototype.render = function () {
    this.dom = document.createElement('hr');
    this.dom.className = 'HorizontalRule';
    this.parent.appendChild(this.dom);
};

export default HorizontalRule;