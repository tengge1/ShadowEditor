import BaseEvent from '../BaseEvent';

/**
 * 场景背景改变改变事件
 * @param {*} app 
 */
function SceneBackgroundChangedEvent(app) {
    BaseEvent.call(this, app);
}

SceneBackgroundChangedEvent.prototype = Object.create(BaseEvent.prototype);
SceneBackgroundChangedEvent.prototype.constructor = SceneBackgroundChangedEvent;

SceneBackgroundChangedEvent.prototype.start = function () {
    var _this = this;
    this.app.on('sceneBackgroundChanged.' + this.id, function (backgroundColor) {
        _this.onSceneBackgroundChanged(backgroundColor);
    });
};

SceneBackgroundChangedEvent.prototype.stop = function () {
    this.app.on('sceneBackgroundChanged.' + this.id, null);
};

SceneBackgroundChangedEvent.prototype.onSceneBackgroundChanged = function (backgroundColor) {
    var scene = this.app.editor.scene;

    scene.background.setHex(backgroundColor);
    this.app.call('render');
};

export default SceneBackgroundChangedEvent;