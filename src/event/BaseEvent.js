import NotImplementedException from '../exception/NotImplementedException';

var ID = -1;

/**
 * 事件基类
 */
function BaseEvent(app) {
    this.app = app;
    this.id = 'BaseEvent' + ID--;
}

/**
 * 开始执行
 */
BaseEvent.prototype.start = function () {
    throw NotImplementedException();
};

/**
 * 停止执行
 */
BaseEvent.prototype.stop = function () {
    throw NotImplementedException();
};

export default BaseEvent;