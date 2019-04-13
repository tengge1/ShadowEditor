import TiledImageLayer from '../TiledImageLayer';
import GeoUtils from '../../../utils/GeoUtils';

/**
 * 谷歌瓦片图层
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 
 */
function GoogleTiledLayer(globe) {
    TiledImageLayer.call(this, globe);

    this.name = 'google';
}

GoogleTiledLayer.prototype = Object.create(TiledImageLayer.prototype);
GoogleTiledLayer.prototype.constructor = GoogleTiledLayer;

GoogleTiledLayer.prototype.getUrl = function (x, y, z) {
    return `http://www.google.cn/maps/vt?lyrs=s@821&gl=cn&x=${x}&y=${y}&z=${z}`;
};

export default GoogleTiledLayer;