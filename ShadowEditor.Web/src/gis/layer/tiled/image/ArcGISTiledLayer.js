import TiledImageLayer from '../TiledImageLayer';

/**
 * ArcGIS瓦片图层
 * @author tengge / https://github.com/tengge1
 */
function ArcGISTiledLayer() {
    TiledImageLayer.call(this);
}

ArcGISTiledLayer.prototype = Object.create(TiledImageLayer.prototype);
ArcGISTiledLayer.prototype.constructor = ArcGISTiledLayer;

ArcGISTiledLayer.prototype.get = function (aabb) {

};

export default ArcGISTiledLayer;