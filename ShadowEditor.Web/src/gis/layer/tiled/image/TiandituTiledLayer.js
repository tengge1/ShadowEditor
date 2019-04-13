import TiledImageLayer from '../TiledImageLayer';

/**
 * 天地图瓦片图层
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 
 */
function TiandituTiledLayer(globe) {
    TiledImageLayer.call(this, globe);
}

TiandituTiledLayer.prototype = Object.create(TiledImageLayer.prototype);
TiandituTiledLayer.prototype.constructor = TiandituTiledLayer;

TiandituTiledLayer.prototype.get = function (aabb) {

};

export default TiandituTiledLayer;