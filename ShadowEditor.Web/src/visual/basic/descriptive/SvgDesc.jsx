import { SvgControl, SVG } from '../third_party';

/**
 * Desc
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Desc(options = {}) {
    SvgControl.call(this, options);
}

Desc.prototype = Object.create(SvgControl.prototype);
Desc.prototype.constructor = Desc;

Desc.prototype.render = function () {
    this.renderDom(this.createElement('desc'));
};

SVG.addXType('desc', Desc);

export default Desc;