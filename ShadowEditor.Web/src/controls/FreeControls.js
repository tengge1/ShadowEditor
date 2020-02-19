import BaseControls from './BaseControls';
import { TWEEN } from '../third_party';

/**
 * 自由控制器
 * @author tengge1 / https://github.com/tengge1
 */
class FreeControls extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);
        this.controls = new THREE.OrbitControls(camera, domElement);
    }

    enable() {
        this.enabled = true;
        this.controls.enabled = true;
    }

    /**
     * 禁用控制器
     */
    disable() {
        this.enabled = false;
        this.controls.enabled = false;
    }

    /**
     * 转到某个物体的视角
     * @param {THREE.Object3D} target 目标
     */
    focus(target) { // eslint-disable-line

    }

    /**
     * 不断循环调用，以便实现动画效果
     * @param {THREE.Clock} clock 时钟
     * @param {Number} deltaTime 间隔时间
     */
    update(clock, deltaTime) { // eslint-disable-line
        this.controls.update();
    }

    /**
     * 当前鼠标所在位置碰撞点世界坐标
     * @param {THREE.Vector3} position 世界坐标
     */
    setPickPosition(position) { // eslint-disable-line

    }

    /**
     * 析构控制器
     */
    dispose() {
        this.controls.dispose();
        this.camera = null;
        this.domElement = null;
    }
}

export default FreeControls;