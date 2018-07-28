import Control from './Control';

/**
 * 容器（外层无div等元素包裹）
 * @param {*} options 
 */
function Container(options) {
    Control.call(this, options);
    options = options || {};

    this.children = options.children || [];
}

Container.prototype = Object.create(Control.prototype);
Container.prototype.constructor = Container;

Container.prototype.add = function (obj) {
    if (!(obj instanceof Control)) {
        throw 'Container: obj is not an instance of Control.';
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
        var obj = UI.create(n);
        obj.parent = _this.parent;
        obj.render();
    });
};

export default Container;