import BaseEvent from '../BaseEvent';

/**
 * 清空场景事件
 * @param {*} app 
 */
function ClearEvent(app) {
    BaseEvent.call(this, app);
}

ClearEvent.prototype = Object.create(BaseEvent.prototype);
ClearEvent.prototype.constructor = ClearEvent;

ClearEvent.prototype.start = function () {
    var _this = this;
    this.app.on('clear.' + this.id, function () {
        _this.onClear();
    });
};

ClearEvent.prototype.stop = function () {
    this.app.on('clear.' + this.id, null);
};

ClearEvent.prototype.onClear = function () {
    var editor = this.app.editor;

    editor.history.clear();
    editor.storage.clear();

    editor.camera.copy(editor.DEFAULT_CAMERA);
    editor.scene.background.setHex(0xaaaaaa);
    editor.scene.fog = null;

    var objects = editor.scene.children;

    while (objects.length > 0) {
        editor.removeObject(objects[0]);
    }

    editor.textures = {};
    editor.scripts = {};

    editor.deselect();

    this.app.call('editorCleared', this);
};

export default ClearEvent;