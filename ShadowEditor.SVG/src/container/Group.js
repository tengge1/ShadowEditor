import { SvgControl, SVG } from '../third_party';

/**
 * SVG线
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Group(options = {}) {
    SvgControl.call(this, options);
}

Group.prototype = Object.create(SvgControl.prototype);
Group.prototype.constructor = Group;

Group.prototype.render = function () {
    this.renderDom(this.createElement('g'));
};

SVG.addXType('g', Group);

export default Group;