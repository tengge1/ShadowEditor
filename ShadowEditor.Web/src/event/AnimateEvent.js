import BaseEvent from './BaseEvent';

/**
 * 动画事件
 * @param {*} app 
 */
function AnimateEvent(app) {
    BaseEvent.call(this, app);
    this.running = false;
    this.clock = new THREE.Clock();
}

AnimateEvent.prototype = Object.create(BaseEvent.prototype);
AnimateEvent.prototype.constructor = AnimateEvent;

AnimateEvent.prototype.start = function () {
    this.running = true;
    requestAnimationFrame(this.onAnimate.bind(this));
};

AnimateEvent.prototype.stop = function () {
    this.running = false;
};

AnimateEvent.prototype.onAnimate = function () {
    this.app.editor.stats.begin();

    var deltaTime = this.clock.getDelta();

    this.app.call('animate', this, this.clock, deltaTime);
    this.app.call('render', this);

    this.app.editor.stats.end();

    if (this.running) {
        requestAnimationFrame(this.onAnimate.bind(this));
    }
};

export default AnimateEvent;