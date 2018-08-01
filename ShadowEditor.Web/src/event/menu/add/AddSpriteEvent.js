import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加精灵事件
 * @param {*} app 
 */
function AddSpriteEvent(app) {
    MenuEvent.call(this, app);
}

AddSpriteEvent.prototype = Object.create(MenuEvent.prototype);
AddSpriteEvent.prototype.constructor = AddSpriteEvent;

AddSpriteEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddSprite.' + this.id, function () {
        _this.onAddSprite();
    });
};

AddSpriteEvent.prototype.stop = function () {
    this.app.on('mAddSprite.' + this.id, null);
};

AddSpriteEvent.prototype.onAddSprite = function () {
    var editor = this.app.editor;

    var sprite = new THREE.Sprite(new THREE.SpriteMaterial());
    sprite.name = '精灵' + ID++;

    editor.execute(new AddObjectCommand(sprite));
};

export default AddSpriteEvent;