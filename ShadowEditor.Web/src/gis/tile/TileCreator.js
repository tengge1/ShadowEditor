/**
 * 瓦片创建者
 * @author tengge / https://github.com/tengge1
 * @param {*} camera 
 */
function TileCreator(camera) {
    this.camera = camera;
}

TileCreator.prototype.get = function (lon, lat, alt) {
    return [];
};

TileCreator.prototype.dispose = function () {
    delete this.camera;
};

export default TileCreator;