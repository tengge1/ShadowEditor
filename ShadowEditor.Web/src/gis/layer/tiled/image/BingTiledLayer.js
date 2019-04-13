import TiledImageLayer from '../TiledImageLayer';

/**
 * 必应瓦片图层
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 
 */
function BingTiledLayer(globe) {
    TiledImageLayer.call(this, globe);
}

BingTiledLayer.prototype = Object.create(TiledImageLayer.prototype);
BingTiledLayer.prototype.constructor = BingTiledLayer;

BingTiledLayer.prototype.get = function (aabb) {

};

export default BingTiledLayer;