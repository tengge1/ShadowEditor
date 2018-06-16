import BaseEvent from '../BaseEvent';

/**
 * 设置场景事件
 * @param {*} app 
 */
function SetSceneEvent(app) {
    BaseEvent.call(this, app);
}

SetSceneEvent.prototype = Object.create(BaseEvent.prototype);
SetSceneEvent.prototype.constructor = SetSceneEvent;

SetSceneEvent.prototype.start = function () {
    var _this = this;
    this.app.on('setScene.' + this.id, function (scene) {
        _this.onSetScene(scene);
    });
};

SetSceneEvent.prototype.stop = function () {
    this.app.on('setScene.' + this.id, null);
};

SetSceneEvent.prototype.onSetScene = function (scene) {
    var editor = this.app.editor;

    editor.scene.uuid = scene.uuid;
    editor.scene.name = scene.name;

    if (scene.background !== null) editor.scene.background = scene.background.clone();
    if (scene.fog !== null) editor.scene.fog = scene.fog.clone();

    editor.scene.userData = JSON.parse(JSON.stringify(scene.userData));

    // avoid render per object

    editor.signals.sceneGraphChanged.active = false;

    while (scene.children.length > 0) {

        editor.addObject(scene.children[0]);

    }

    editor.signals.sceneGraphChanged.active = true;
    editor.signals.sceneGraphChanged.dispatch();
};

export default SetSceneEvent;