import MenuEvent from '../MenuEvent';

/**
 * 源码事件
 * @param {*} app 
 */
function SourceCodeEvent(app) {
    MenuEvent.call(this, app);
}

SourceCodeEvent.prototype = Object.create(MenuEvent.prototype);
SourceCodeEvent.prototype.constructor = SourceCodeEvent;

SourceCodeEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mSourceCode.' + this.id, function () {
        _this.onSourceCode();
    });
};

SourceCodeEvent.prototype.stop = function () {
    this.app.on('mSourceCode.' + this.id, null);
};

SourceCodeEvent.prototype.onSourceCode = function () {
    window.open('https://github.com/mrdoob/three.js/tree/master/editor', '_blank');
};

export default SourceCodeEvent;