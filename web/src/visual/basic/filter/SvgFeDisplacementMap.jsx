import { SvgControl, SVG } from '../third_party';

/**
 * feDisplacementMap
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feDisplacementMap(options = {}) {
    SvgControl.call(this, options);
}

feDisplacementMap.prototype = Object.create(SvgControl.prototype);
feDisplacementMap.prototype.constructor = feDisplacementMap;

feDisplacementMap.prototype.render = function () {
    this.renderDom(this.createElement('feDisplacementMap'));
};

SVG.addXType('fedisplacementmap', feDisplacementMap);

export default feDisplacementMap;