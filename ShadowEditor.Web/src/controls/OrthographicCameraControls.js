/**
 * 正交相机控制器
 * @param {THREE.OrthographicCamera} camera 正交相机
 * @param {HTMLElement} domElement DOM
 */
function OrthographicCameraControls(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.onMouseWheel = this.onMouseWheel.bind(this);
}

OrthographicCameraControls.prototype.enable = function () {
    app.on(`mousewheel.${this.id}`, this.onMouseWheel);
};

OrthographicCameraControls.prototype.disable = function () {
    app.on(`mousewheel.${this.id}`, null);
};

OrthographicCameraControls.prototype.onMouseWheel = function (event) {
    const delta = event.wheelDelta / 10;

    let camera = this.camera;

    // switch (app.editor.view) {
    //     case 'front':
    //         camera.position.x += delta;
    //         break;
    //     case 'side':
    //         camera.position.z += delta;
    //         break;
    //     case 'top':
    //         camera.position.y += delta;
    //         break;
    // }
};

export default OrthographicCameraControls;