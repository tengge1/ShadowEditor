/**
 * 瓦片创建者
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 地球
 */
function TileCreator(globe) {
    this.globe = globe;
    this.options = this.globe.options;
    this.camera = this.globe.camera;
    this.renderer = this.globe.renderer;
}

TileCreator.prototype.get = function (lon, lat, alt) { // eslint-disable-line
    return [];
};

TileCreator.prototype.dispose = function () {
    delete this.globe;
    delete this.options;
    delete this.camera;
    delete this.renderer;
};

export default TileCreator;