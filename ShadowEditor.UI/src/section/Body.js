import { Control, UI } from '../third_party';

/**
 * Body
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Body(options = {}) {
    Control.call(this, options);
}

Body.prototype = Object.create(Control.prototype);
Body.prototype.constructor = Body;

Body.prototype.render = function () {
    this.renderDom(this.createElement('body'));
};

UI.addXType('body', Body);

export default Body;