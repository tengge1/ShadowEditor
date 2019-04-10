import TiledImageLayer from '../TiledImageLayer';

/**
 * 谷歌瓦片图层
 * @author tengge / https://github.com/tengge1
 */
function GoogleTiledLayer() {
    TiledImageLayer.call(this);
}

GoogleTiledLayer.prototype = Object.create(TiledImageLayer.prototype);
GoogleTiledLayer.prototype.constructor = GoogleTiledLayer;

GoogleTiledLayer.prototype.get = function (aabb) {

};

export default GoogleTiledLayer;