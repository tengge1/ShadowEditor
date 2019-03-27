var ID = -1;

/**
 * 查看器
 * @param {*} camera 相机
 * @param {*} domElement 文档
 */
function Viewer(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.id = `${this.constructor.name}${ID--}`;
};

Viewer.prototype.update = function () {

};

Viewer.prototype.dispose = function () {
    delete this.camera;
    delete this.domElement;
};

export default Viewer;