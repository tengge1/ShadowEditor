import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';

var ID = 1;

/**
 * 添加火焰事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function AddFireEvent(app) {
    MenuEvent.call(this, app);
    this.fires = [];
}

AddFireEvent.prototype = Object.create(MenuEvent.prototype);
AddFireEvent.prototype.constructor = AddFireEvent;

AddFireEvent.prototype.start = function () {
    var _this = this;
    this.app.on('mAddFire.' + this.id, this.onAddFire.bind(this));
    this.app.on('objectRemoved.' + this.id, this.onObjectRemoved.bind(this));
};

AddFireEvent.prototype.stop = function () {
    this.app.on('mAddFire.' + this.id, null);
    this.app.on('objectRemoved.' + this.id, null);
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

    fire.mesh.name = '火焰' + ID++;
    fire.mesh.geometry.boundingBox = new THREE.Box3(
        new THREE.Vector3(-fireWidth, -fireHeight, -fireDepth),
        new THREE.Vector3(fireWidth, fireHeight, fireDepth)
    );
    fire.mesh.geometry.boundingSphere = new THREE.Sphere( // 没有boundingSphere则无法选中
        new THREE.Vector3(),
        fireHeight / 2
    );
    fire.mesh.position.y = 2;
    editor.execute(new AddObjectCommand(fire.mesh));

    this.fires.push(fire);

    this.app.on(`animate.` + this.id, this.onAnimate.bind(this));
};

AddFireEvent.prototype.onObjectRemoved = function (object) {
    var index = this.fires.findIndex(function (n) {
        return n.mesh === object;
    });
    if (index > -1) {
        this.fires.splice(index, 1);
    }

    if (this.fires.length === 0) {
        this.app.on(`animate.` + this.id, null);
    }
};

AddFireEvent.prototype.onAnimate = function (clock) {
    var elapsed = clock.getElapsedTime();

    this.fires.forEach(function (fire) {
        fire.update(elapsed);
    });
};

export default AddFireEvent;