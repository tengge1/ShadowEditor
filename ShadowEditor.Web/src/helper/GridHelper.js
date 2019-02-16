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
    var scene = this.app.editor.sceneHelpers;

    this.grid = new THREE.GridHelper(30, 30, 0x444444, 0x888888);

    scene.add(this.grid);
};

GridHelper.prototype.stop = function () {
    if (this.grid) {
        var scene = this.app.editor.sceneHelpers;
        scene.remove(this.grid);
        delete this.grid;
    }
};

export default GridHelper;