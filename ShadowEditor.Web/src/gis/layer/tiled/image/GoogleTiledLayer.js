import TiledImageLayer from '../TiledImageLayer';
import GeoUtils from '../../../utils/GeoUtils';

/**
 * 谷歌瓦片图层
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 
 */
function GoogleTiledLayer(globe) {
    TiledImageLayer.call(this, globe);
}

GoogleTiledLayer.prototype = Object.create(TiledImageLayer.prototype);
GoogleTiledLayer.prototype.constructor = GoogleTiledLayer;

/**
 * 获取某个经纬度范围内的资源
 * @param {THREE.Box2} aabb 
 * @param {Number} z 层级
 */
GoogleTiledLayer.prototype.get = function (aabb, z) {
    var minLon = aabb.min.x,
        minLat = GeoUtils._mercatorLat(aabb.min.y),
        maxLon = aabb.max.x,
        maxLat = GeoUtils._mercatorLat(aabb.max.y);

    var size = Math.PI * 2 / 2 ** z,
        minX = Math.floor(minLon / size),
        minY = Math.floor(minLat / size),
        maxX = Math.ceil(maxLon / size),
        maxY = Math.ceil(maxLat / size);
};

export default GoogleTiledLayer;