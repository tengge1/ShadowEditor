import Control from './Control';

/**
 * 所有带有子项的控件基类
 * @param {*} options 
 */
function Container(options) {
    Control.call(this, options);
    this.children = options.children || [];
}

Container.prototype = Object.create(Control.prototype);
Container.prototype.constructor = Container;

Container.prototype.add = function (obj) {
    if (!obj instanceof Control) {
        throw 'Container: obj is not an instanceof Control.';
    }
    this.children.push(obj);
};

Container.prototype.remove = function (obj) {
    var index = this.children.indexOf(obj);
    if (index > -1) {
        this.children.splice(index, 1);
    }
};

Container.prototype.render = function () {
    var _this = this;
    this.children.forEach(function (n) {
        if (!n instanceof Control) {
            throw 'Container: n is not an instance of Control.';
        }
        n.parent = _this.parent;
        n.render();
    });
};

export default Container;