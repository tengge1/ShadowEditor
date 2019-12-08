import { SvgControl, SVG } from '../third_party';

/**
 * feMergeNode
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function feMergeNode(options = {}) {
    SvgControl.call(this, options);
}

feMergeNode.prototype = Object.create(SvgControl.prototype);
feMergeNode.prototype.constructor = feMergeNode;

feMergeNode.prototype.render = function () {
    this.renderDom(this.createElement('feMergeNode'));
};

SVG.addXType('femergenode', feMergeNode);

export default feMergeNode;