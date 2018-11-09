import { Control, UI } from '../third_party';

/**
 * FigCaption
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function FigCaption(options = {}) {
    Control.call(this, options);
}

FigCaption.prototype = Object.create(Control.prototype);
FigCaption.prototype.constructor = FigCaption;

FigCaption.prototype.render = function () {
    this.renderDom(this.createElement('figcaption'));
};

UI.addXType('figcaption', FigCaption);

export default FigCaption;