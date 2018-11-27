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
        // 参考：https://blog.csdn.net/wendelle/article/details/80058486
        this.control = new THREE.OrbitControls(camera, renderer.domElement);
        // 使用阻尼,指定是否有惯性
        this.control.enableDamping = true;
        // 动态阻尼系数 就是鼠标拖拽旋转灵敏度，阻尼越小越灵敏
        this.control.dampingFactor = 0.25;
        // 是否可以缩放
        this.control.enableZoom = true;
        //是否自动旋转
        this.control.autoRotate = false;
        //设置相机距离原点的最近距离
        this.control.minDistance = 0;
        //设置相机距离原点的最远距离
        this.control.maxDistance = 10000;
        //是否开启右键拖拽
        this.control.enablePan = true;
        this.control.panSpeed = 0.5;
        this.control.enableRotate = true;
        this.control.rotateSpeed = 0.5;
    } else if (type === 'PointerLockControls') {
        this.control = new THREE.PointerLockControls(camera, renderer.domElement);
        this.control.lock();
    } else if (type === 'TrackballControls') {
        this.control = new THREE.TrackballControls(camera, renderer.domElement);
    } else {

    }
};

PlayerControl.prototype.update = function (clock, deltaTime) {
    if (this.control instanceof THREE.FirstPersonControls ||
        this.control instanceof THREE.FlyControls ||
        this.control instanceof THREE.TrackballControls
    ) {
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