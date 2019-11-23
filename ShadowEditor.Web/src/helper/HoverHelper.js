import BaseHelper from './BaseHelper';

/**
 * 鼠标移入帮助器
 * @author tengge / https://github.com/tengge1
 * @param {*} app 应用程序
 */
function HoverHelper(app) {
    BaseHelper.call(this, app);
    this.onGpuPick = this.onGpuPick.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
}

HoverHelper.prototype = Object.create(BaseHelper.prototype);
HoverHelper.prototype.constructor = HoverHelper;

HoverHelper.prototype.start = function () {
    this.time = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.object = null;
    this.scene = new THREE.Scene();
    this.scene.overrideMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.5
    });

    app.on(`gpuPick.${this.id}`, this.onGpuPick);
    app.on(`objectRemoved.${this.id}`, this.onObjectRemoved.bind(this));
    app.on(`afterRender.${this.id}`, this.onAfterRender);
};

HoverHelper.prototype.stop = function () {
    app.on(`gpuPick.${this.id}`, null);
    app.on(`objectRemoved.${this.id}`, null);
    app.on(`afterRender.${this.id}`, null);
};

HoverHelper.prototype.onGpuPick = function (obj) {
    this.object = obj.object;
};

HoverHelper.prototype.onObjectRemoved = function (object) {
    if (object === this.object) {
        this.object = null;
    }
};

HoverHelper.prototype.onAfterRender = function () {
    if (!this.object || !this.object.parent) {
        // TODO: this.object.parent为null时表示该物体被移除
        return;
    }

    const { camera, renderer } = app.editor;

    const parent = this.object.parent;
    const index = parent.children.indexOf(this.object);

    this.scene.add(this.object);
    renderer.render(this.scene, camera);
    this.scene.remove(this.object);

    this.object.parent = parent;
    parent.children.splice(index, 0, this.object);
};

export default HoverHelper;