var ID = -1;

/**
 * 帮助器基类
 * @author tengge / https://github.com/tengge1
 */
function BaseHelper() {
    this.id = `${this.constructor.name}${ID--}`;
}

/**
 * 帮助器开始运行
 * @description 因为start是在`appStarted`事件中运行的，所以无法监听到`appStart`和`appStarted`事件
 */
BaseHelper.prototype.start = function () {

};

/**
 * 帮助器结束运行
 */
BaseHelper.prototype.stop = function () {

};

export default BaseHelper;