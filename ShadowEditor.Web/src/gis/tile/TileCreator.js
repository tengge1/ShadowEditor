/**
 * 瓦片创建者
 * @author tengge / https://github.com/tengge1
 * @param {*} camera 
 * @param {*} options 
 */
function TileCreator(camera, options) {
    this.camera = camera;
    this.options = options;
}

TileCreator.prototype.get = function (lon, lat, alt) {
    return [];
};

TileCreator.prototype.dispose = function () {
    delete this.camera;
};

export default TileCreator;