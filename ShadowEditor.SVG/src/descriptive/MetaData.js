import { SvgControl, SVG } from '../third_party';

/**
 * MetaData
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function MetaData(options = {}) {
    SvgControl.call(this, options);
}

MetaData.prototype = Object.create(SvgControl.prototype);
MetaData.prototype.constructor = MetaData;

MetaData.prototype.render = function () {
    this.renderDom(this.createElement('metadata'));
};

SVG.addXType('metadata', MetaData);

export default MetaData;