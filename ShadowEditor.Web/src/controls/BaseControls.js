let ID = -1;

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

        this.id = `${this.constructor.name}${ID--}`;

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
    focus(target) { // eslint-disable-line

    }

    /**
     * 析构控制器
     */
    dispose() {
        this.camera = null;
        this.domElement = null;
    }
}

export default BaseControls;