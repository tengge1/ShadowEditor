import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';
import Smoke from '../../../particle/Smoke';

var ID = 1;

/**
 * 添加烟事件
 * @param {*} app 
 */
function AddSmokeEvent(app) {
    MenuEvent.call(this, app);
    this.smokes = [];
}

AddSmokeEvent.prototype = Object.create(MenuEvent.prototype);
AddSmokeEvent.prototype.constructor = AddSmokeEvent;

AddSmokeEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddSmoke.' + this.id, this.onAddSmoke.bind(this));
    this.app.on('objectRemoved.' + this.id, this.onObjectRemoved.bind(this));
};

AddSmokeEvent.prototype.stop = function () {
    this.app.on('mAddSmoke.' + this.id, null);
    this.app.on('objectRemoved.' + this.id, null);
};

AddSmokeEvent.prototype.onAddSmoke = function () {
    var editor = this.app.editor;
    var camera = editor.camera;
    var renderer = editor.renderer;

    var smoke = new Smoke(camera, renderer);

    smoke.mesh.name = 'Smoke ' + ID++;
    smoke.mesh.useSelectionBox = false;
    smoke.mesh.position.y = 3;
    smoke.mesh.scale
    editor.execute(new AddObjectCommand(smoke.mesh));

    this.smokes.push(smoke);

    this.app.on(`animate.` + this.id, this.onAnimate.bind(this));
};

AddSmokeEvent.prototype.onObjectRemoved = function (object) {
    var index = this.smokes.findIndex(function (n) {
        return n.mesh === object;
    });
    if (index > -1) {
        this.smokes.splice(index, 1);
    }

    if (this.smokes.length === 0) {
        this.app.on(`animate.` + this.id, null);
    }
};

AddSmokeEvent.prototype.onAnimate = function (clock) {
    var elapsed = clock.getElapsedTime();

    this.smokes.forEach(function (smoke) {
        smoke.update(elapsed);
    });
};

export default AddSmokeEvent;