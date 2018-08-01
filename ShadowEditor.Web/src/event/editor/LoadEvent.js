import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';

/**
 * 加载场景事件
 * @param {*} app 
 */
function LoadEvent(app) {
    BaseEvent.call(this, app);
}

LoadEvent.prototype = Object.create(BaseEvent.prototype);
LoadEvent.prototype.constructor = LoadEvent;

LoadEvent.prototype.start = function () {
    var _this = this;
    this.app.on('load.' + this.id, function () {
        _this.onLoad();
    });
};

LoadEvent.prototype.stop = function () {
    this.app.on('load.' + this.id, null);
};

LoadEvent.prototype.onLoad = function () {
    UI.msg('加载场景成功！');
};

export default LoadEvent;