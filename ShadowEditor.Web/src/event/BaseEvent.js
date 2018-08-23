var ID = -1;

/**
 * 事件基类
 * @author tengge / https://github.com/tengge1
 */
function BaseEvent(app) {
    this.app = app;
    this.id = `BaseEvent${ID--}`;
}

/**
 * 开始执行
 */
BaseEvent.prototype.start = function () {

};

/**
 * 停止执行
 */
BaseEvent.prototype.stop = function () {

};

export default BaseEvent;