import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加火焰事件
 * @param {*} app 
 */
function AddFireEvent(app) {
    MenuEvent.call(this, app);
}

AddFireEvent.prototype = Object.create(MenuEvent.prototype);
AddFireEvent.prototype.constructor = AddFireEvent;

AddFireEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddFire.' + this.id, function () {
        _this.onAddFire();
    });
};

AddFireEvent.prototype.stop = function () {
    this.app.on('mAddFire.' + this.id, null);
};

AddFireEvent.prototype.onAddFire = function () {
    var editor = this.app.editor;
    var camera = editor.camera;

    VolumetricFire.texturePath = 'assets/textures/VolumetricFire/';

    var fireWidth = 2;
    var fireHeight = 4;
    var fireDepth = 2;
    var sliceSpacing = 0.5;

    var fire = new VolumetricFire(
        fireWidth,
        fireHeight,
        fireDepth,
        sliceSpacing,
        camera
    );

    fire.mesh.name = 'Fire ' + ID++;
    fire.mesh.position.y = 2;
    editor.execute(new AddObjectCommand(fire.mesh));

    this.app.on(`animate.Fire${ID - 1}`, function (clock) {
        var elapsed = clock.getElapsedTime();

        fire.update(elapsed);
    });
};

export default AddFireEvent;