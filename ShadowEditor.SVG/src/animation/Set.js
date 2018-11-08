import { SvgControl, SVG } from '../third_party';

/**
 * Set
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Set(options = {}) {
    SvgControl.call(this, options);
}

Set.prototype = Object.create(SvgControl.prototype);
Set.prototype.constructor = Set;

Set.prototype.render = function () {
    this.renderDom(this.createElement('set'));
};

SVG.addXType('set', Set);

export default Set;