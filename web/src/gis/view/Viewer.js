var ID = -1;

/**
 * 查看器
 * @author tengge / https://github.com/tengge1
 * @param {*} camera 相机
 * @param {*} domElement 文档
 */
function Viewer(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.id = `${this.constructor.name}${ID--}`;

    this.oldFar = this.camera.far;
    this.camera.far = 20576957;
    this.camera.updateProjectionMatrix();
}

Viewer.prototype.update = function () {

};

Viewer.prototype.dispose = function () {
    this.camera.far = this.oldFar;
    this.camera.updateProjectionMatrix();

    delete this.oldFar;
    delete this.camera;
    delete this.domElement;
};

export default Viewer;