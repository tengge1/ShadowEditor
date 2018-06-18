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

    // editor.signals.sceneGraphChanged.active = false;

    // // 当纹理为base64编码时，如果不设置complete=true，则three.js认为纹理未下载完成，会报错。
    // scene.traverse(function (n) {
    //     if (n instanceof THREE.Mesh && n.material.map != null && n.material.map.image != null) {
    //         n.material.map.image.complete = true;
    //     }
    // });

    while (scene.children.length > 0) {

        editor.addObject(scene.children[0]);

    }

    // editor.signals.sceneGraphChanged.active = true;
    this.app.call('sceneGraphChanged', this);
};

export default SetSceneEvent;