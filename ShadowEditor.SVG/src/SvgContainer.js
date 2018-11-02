import SvgControl from './SvgControl';

/**
 * SVG容器
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SvgContainer(options = {}) {
    SvgControl.call(this, options);

    this.children = options.children || [];
}

SvgContainer.prototype = Object.create(SvgControl.prototype);
SvgContainer.prototype.constructor = SvgContainer;

SvgContainer.prototype.add = function (obj) {
    if (!(obj instanceof SvgControl)) {
        throw 'SvgContainer: obj is not an instance of SvgControl.';
    }
    this.children.push(obj);
};

SvgContainer.prototype.remove = function (obj) {
    var index = this.children.indexOf(obj);
    if (index > -1) {
        this.children.splice(index, 1);
    }
};

SvgContainer.prototype.render = function () {
    this.children.forEach(n => {
        var obj = SVG.create(n);
        obj.parent = this.parent;
        obj.render();
    });
};

export default SvgContainer;