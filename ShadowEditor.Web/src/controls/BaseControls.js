/**
 * 控制器基类
 * @author tengge1 / https://github.com/tengge1
 */
class BaseControls extends THREE.EventDispatcher {
    /**
     * 创建一个控制器
     * @param {THREE.Camera} camera 相机
     * @param {HTMLElement} domElement HTML文档
     */
    constructor(camera, domElement) {
        super();
        this.camera = camera;
        this.domElement = domElement;

        this.changeEvent = { type: 'change' };
    }

    /**
     * 启用控制器
     */
    enable() {

    }

    /**
     * 禁用控制器
     */
    disable() {

    }

    /**
     * 转到某个物体的视角
     * @param {THREE.Object3D} target 目标
     */
    focus(target) {

    }

    /**
     * 设置相机到中心点
     * @param {THREE.Vector3} center 中心点
     */
    setCenter(center) {

    }

    /**
     * 析构控制器
     */
    dispose() {

    }
}

export default BaseControls;