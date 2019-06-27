import BaseHelper from './BaseHelper';

/**
 * 网格帮助器
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function GridHelper(app) {
    BaseHelper.call(this, app);
}

GridHelper.prototype = Object.create(BaseHelper.prototype);
GridHelper.prototype.constructor = GridHelper;

GridHelper.prototype.start = function () {
    app.on(`storageChanged.${this.id}`, this.onStorageChanged.bind(this));
    this.update();
};

GridHelper.prototype.stop = function () {
    app.on(`appStarted.${this.id}`, null);

    if (this.helper) {
        var scene = app.editor.sceneHelpers;
        scene.remove(this.helper);
        delete this.helper;
    }
};

GridHelper.prototype.update = function () {
    var showGrid = app.storage.get('showGrid');

    if (!this.helper) {
        this.helper = new THREE.GridHelper(30, 30, 0x444444, 0x888888);
    }

    var scene = app.editor.sceneHelpers;

    if (showGrid && this.helper.parent !== scene) {
        scene.add(this.helper);
    } else if (!showGrid && this.helper.parent === scene) {
        scene.remove(this.helper);
    }
};

GridHelper.prototype.onStorageChanged = function (key, value) {
    if (key === 'showGrid') {
        this.update();
    }
};

export default GridHelper;