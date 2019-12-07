import { SvgControl, SVG } from '../third_party';

/**
 * ForeignObject
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ForeignObject(options = {}) {
    SvgControl.call(this, options);
}

ForeignObject.prototype = Object.create(SvgControl.prototype);
ForeignObject.prototype.constructor = ForeignObject;

ForeignObject.prototype.render = function () {
    this.renderDom(this.createElement('foreignObject'));
};

SVG.addXType('foreignobject', ForeignObject);

export default ForeignObject;