import PlayerComponent from './PlayerComponent';

/**
 * 播放器场景控制
 * @param {*} app 应用
 */
function PlayerControl(app) {
    PlayerComponent.call(this, app);

    this.control = null;
}

PlayerControl.prototype = Object.create(PlayerComponent.prototype);
PlayerControl.prototype.constructor = PlayerControl;

PlayerControl.prototype.create = function (scene, camera, renderer) {
    var type = camera.userData.control;

    if (type === 'FirstPersonControls') { // 第一视角控制器
        this.control = new THREE.FirstPersonControls(camera, renderer.domElement);
        if (camera.userData.firstPersonOptions) {
            Object.assign(this.control, camera.userData.firstPersonOptions);
        }
    } else if (type === 'FlyControls') { // 飞行控制器
        this.control = new THREE.FlyControls(camera, renderer.domElement);
        if (camera.userData.flyOptions) {
            Object.assign(this.control, camera.userData.flyOptions);
        }
    } else if (type === 'OrbitControls') { // 轨道控制器
        this.control = new THREE.OrbitControls(camera, renderer.domElement);
        if (camera.userData.orbitOptions) {
            Object.assign(this.control, camera.userData.orbitOptions);
        }
    } else if (type === 'PointerLockControls') { // 指针锁定控制器
        this.control = new THREE.PointerLockControls(camera, renderer.domElement);
        this.control.lock();
    } else if (type === 'TrackballControls') { // 轨迹球控制器
        this.control = new THREE.TrackballControls(camera, renderer.domElement);
    } else {

    }
};

PlayerControl.prototype.update = function (clock, deltaTime) {
    if (!(this.control instanceof THREE.PointerLockControls)) {
        this.control.update(deltaTime);
    }
};

PlayerControl.prototype.dispose = function () {
    if (this.control) {
        this.control.dispose();
        this.control = null;
    }
};

export default PlayerControl;