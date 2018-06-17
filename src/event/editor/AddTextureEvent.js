import BaseEvent from '../BaseEvent';

/**
 * 添加纹理事件
 * @param {*} app 
 */
function AddTextureEvent(app) {
    BaseEvent.call(this, app);
}

AddTextureEvent.prototype = Object.create(BaseEvent.prototype);
AddTextureEvent.prototype.constructor = AddTextureEvent;

AddTextureEvent.prototype.start = function () {
    var _this = this;
    this.app.on('addTexture.' + this.id, function (texture) {
        _this.onAddTexture(texture);
    });
};

AddTextureEvent.prototype.stop = function () {
    this.app.on('addTexture.' + this.id, null);
};

AddTextureEvent.prototype.onAddTexture = function (texture) {
    var editor = this.app.editor;

    editor.textures[texture.uuid] = texture;
};

export default AddTextureEvent;