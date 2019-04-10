import TiledImageLayer from '../TiledImageLayer';

/**
 * 必应瓦片图层
 * @author tengge / https://github.com/tengge1
 */
function BingTiledLayer() {
    TiledImageLayer.call(this);
}

BingTiledLayer.prototype = Object.create(TiledImageLayer.prototype);
BingTiledLayer.prototype.constructor = BingTiledLayer;

BingTiledLayer.prototype.get = function (aabb) {

};

export default BingTiledLayer;