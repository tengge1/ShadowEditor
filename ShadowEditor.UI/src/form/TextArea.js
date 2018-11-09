import { Control, UI } from '../third_party';

/**
 * TextArea
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TextArea(options = {}) {
    Control.call(this, options);
}

TextArea.prototype = Object.create(Control.prototype);
TextArea.prototype.constructor = TextArea;

TextArea.prototype.render = function () {
    this.renderDom(this.createElement('textarea'));
};

UI.addXType('textarea', TextArea);

export default TextArea;