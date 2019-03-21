import TiledLayer from './TiledLayer';

/**
 * 必应地图图层
 */
function BingTiledLayer() {
    TiledLayer.call(this);
}

BingTiledLayer.prototype = Object.create(TiledLayer.prototype);
BingTiledLayer.prototype.constructor = BingTiledLayer;

export default BingTiledLayer;