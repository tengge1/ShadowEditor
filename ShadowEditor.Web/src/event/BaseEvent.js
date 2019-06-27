var ID = -1;

/**
 * 事件基类
 * @author tengge / https://github.com/tengge1
 */
function BaseEvent(app) {
    app = app;
    this.id = `${this.constructor.name}${ID--}`;
}

BaseEvent.prototype.start = function () {

};

BaseEvent.prototype.stop = function () {

};

export default BaseEvent;