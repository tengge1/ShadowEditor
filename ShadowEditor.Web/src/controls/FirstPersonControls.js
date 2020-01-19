import BaseControls from './BaseControls';

const STATE = {
    Forward: 1, // 前进
    Backward: 2, // 后退
    Left: 3, // 向左移动
    Right: 4 // 向右移动
};

/**
 * 第一视角控制器
 * @author tengge1 / https://github.com/tengge1
 */
class FirstPersonControls extends BaseControls {
    constructor(camera, domElement) {
        super(camera, domElement);

        this.panSpeed = 0.1;
        this.rotationSpeed = 0.01;

        this.state = null;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        this.domElement.addEventListener('keydown', this.onKeyDown, false);
        this.domElement.addEventListener('keyup', this.onKeyUp, false);
    }

    focus(target) {
    }

    onKeyDown(event) {

    }

    onKeyUp(event) {

    }

    dispose() {
        this.camera = null;
        this.domElement = null;
        this.domElement.removeEventListener('keydown', this.onKeyDown);
        this.domElement.removeEventListener('keyup', this.onKeyUp);
    }
}

export default FirstPersonControls;