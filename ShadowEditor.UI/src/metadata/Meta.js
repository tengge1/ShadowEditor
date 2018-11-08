import { Control, UI } from '../third_party';

/**
 * Meta
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Meta(options = {}) {
    Control.call(this, options);
}

Meta.prototype = Object.create(Control.prototype);
Meta.prototype.constructor = Meta;

Meta.prototype.render = function () {
    this.renderDom(this.createElement('meta'));
};

UI.addXType('meta', Meta);

export default Meta;