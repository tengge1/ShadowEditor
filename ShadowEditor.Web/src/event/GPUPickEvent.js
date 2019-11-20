import BaseEvent from './BaseEvent';

/**
 * 使用GPU进行碰撞
 * @author tengge / https://github.com/tengge1
 * @param {*} app 应用程序
 */
function GPUPickEvent(app) {
    BaseEvent.call(this, app);

    this.onMouseMove = this.onMouseMove.bind(this);
}

GPUPickEvent.prototype = Object.create(BaseEvent.prototype);
GPUPickEvent.prototype.constructor = GPUPickEvent;

GPUPickEvent.prototype.start = function () {
    app.on(`mousemove.${this.id}`, this.onMouseMove);
};

GPUPickEvent.prototype.stop = function () {
    app.on(`mousemove.${this.id}`, null);
};

GPUPickEvent.prototype.onMouseMove = function (event) {

};

export default GPUPickEvent;