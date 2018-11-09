import { Control, UI } from '../third_party';

/**
 * Section
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Section(options = {}) {
    Control.call(this, options);
}

Section.prototype = Object.create(Control.prototype);
Section.prototype.constructor = Section;

Section.prototype.render = function () {
    this.renderDom(this.createElement('section'));
};

UI.addXType('section', Section);

export default Section;