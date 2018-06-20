import MenuEvent from '../MenuEvent';

/**
 * 保存场景
 * @param {*} app 
 */
function SaveSceneEvent(app) {
    MenuEvent.call(this, app);
}

SaveSceneEvent.prototype = Object.create(MenuEvent.prototype);
SaveSceneEvent.prototype.constructor = SaveSceneEvent;

SaveSceneEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mSaveScene.' + this.id, function () {
        _this.onSaveScene();
    });
};

SaveSceneEvent.prototype.stop = function () {
    this.app.on('mSaveScene.' + this.id, null);
};

SaveSceneEvent.prototype.onSaveScene = function () {
    var editor = this.app.editor;

    editor.save();
};

export default SaveSceneEvent;