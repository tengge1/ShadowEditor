import { Control, UI } from '../third_party';

/**
 * 线性渐变
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function linearGradient(options = {}) {
    Control.call(this, options);
}

linearGradient.prototype = Object.create(Control.prototype);
linearGradient.prototype.constructor = linearGradient;

linearGradient.prototype.render = function () {
    var dom = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    this.renderDom(dom);
};

UI.addXType('svglineargradient', linearGradient);

export default linearGradient;