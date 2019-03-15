import BaseHelper from './BaseHelper';

/**
 * 网格帮助器
 * @param {*} app 
 */
function GridHelper(app) {
    BaseHelper.call(this, app);
}

GridHelper.prototype = Object.create(BaseHelper.prototype);
GridHelper.prototype.constructor = GridHelper;

GridHelper.prototype.start = function () {
    this.app.on(`storageChanged.${this.id}`, this.onStorageChanged.bind(this));
    this.update();
};

GridHelper.prototype.stop = function () {
    this.app.on(`appStarted.${this.id}`, null);

    if (this.grid) {
        var scene = this.app.editor.sceneHelpers;
        scene.remove(this.grid);
        delete this.grid;
    }
};

GridHelper.prototype.update = function () {
    var showGrid = this.app.storage.get('showGrid');

    if (!this.grid) {
        this.grid = new THREE.GridHelper(30, 30, 0x444444, 0x888888);
    }

    var scene = this.app.editor.sceneHelpers;

    if (showGrid && this.grid.parent !== scene) {
        scene.add(this.grid);
    } else if (!showGrid && this.grid.parent === scene) {
        scene.remove(this.grid);
    }
};

GridHelper.prototype.onStorageChanged = function (key, value) {
    if (key === 'showGrid') {
        this.update();
    }
};

export default GridHelper;