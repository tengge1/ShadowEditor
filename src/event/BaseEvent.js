import NotImplementedException from '../exception/NotImplementedException';

/**
 * 事件基类
 */
class BaseEvent {

    constructor(app) {
        this.app = app;
    }

    /**
     * 开始执行
     */
    start() {
        throw NotImplementedException();
    }

    /**
     * 停止执行
     */
    stop() {
        throw NotImplementedException();
    }
}

export default BaseEvent;