import BaseHelper from './BaseHelper';

/**
 * 相机帮助器
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function CameraHelper(app) {
    BaseHelper.call(this, app);
}

CameraHelper.prototype = Object.create(BaseHelper.prototype);
CameraHelper.prototype.constructor = CameraHelper;

CameraHelper.prototype.start = function () {
    app.on(`storageChanged.${this.id}`, this.onStorageChanged.bind(this));
    this.update();
};

CameraHelper.prototype.stop = function () {
    app.on(`appStarted.${this.id}`, null);

    if (this.helper) {
        var scene = app.editor.sceneHelpers;
        scene.remove(this.helper);
        delete this.helper;
    }
};

CameraHelper.prototype.update = function () {
    var showCamera = app.storage.get('showCamera');

    if (!this.helper) {
        this.helper = new THREE.CameraHelper(app.editor.camera);
    }

    var scene = app.editor.sceneHelpers;

    if (showCamera && this.helper.parent !== scene) {
        scene.add(this.helper);
    } else if (!showCamera && this.helper.parent === scene) {
        scene.remove(this.helper);
    }
};

CameraHelper.prototype.onStorageChanged = function (key, value) {
    if (key === 'showCamera') {
        this.update();
    }
};

export default CameraHelper;