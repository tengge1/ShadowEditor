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
        this.enabled = true;
    }

    /**
     * 启用控制器
     */
    enable() {
        this.enabled = true;
    }

    /**
     * 禁用控制器
     */
    disable() {
        this.enabled = false;
    }

    /**
     * 转到某个物体的视角
     * @param {THREE.Object3D} target 目标
     */
    focus(target) {
        scope.dispatchEvent(changeEvent);
    }

    /**
     * 析构控制器
     */
    dispose() {

    }
}

export default BaseControls;