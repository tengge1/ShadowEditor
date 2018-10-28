import Control from '../Control';

/**
 * SvgDom
 * @author tengge / https://github.com/tengge1
 */
function SvgDom(options) {
    Control.call(this, options);

    options = options || {};
    this.width = options.width || 960;
    this.height = options.height || 500;
    this.children = [];
}

SvgDom.prototype = Object.create(Control.prototype);
SvgDom.prototype.constructor = SvgDom;

SvgDom.prototype.add = function (element) {
    this.children.push(element);
};

SvgDom.prototype.insert = function (index, element) {
    this.children.splice(index, 0, element);
};

SvgDom.prototype.remove = function (element) {
    var index = this.children.indexOf(element);
    if (index > -1) {
        this.removeAt(index);
    }
};

SvgDom.prototype.removeAt = function (index) {
    this.children.splice(index, 1);
};

SvgDom.prototype.removeAll = function () {
    this.children = [];
};

SvgDom.prototype.clear = function () {
    this.removeAll();
};

SvgDom.prototype.render = function () {
    this.el = this.parent.append('svg')
        .attr('width', this.width)
        .attr('height', this.height);
    var _this = this;
    this.children.forEach(function (n) {
        n.parent = _this.el;
        n.render.call(n);
    });
};

export default SvgDom;