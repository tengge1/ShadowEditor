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
 * 获取图片数据
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
GoogleTiledLayer.prototype.get = function (x, y, z) {
    var img = this.cache.get(x, y, z);

    if (img && img.loaded) {
        return img;
    }

    if (img && (img.loading || img.error)) {
        return null;
    }

    if (this.globe.thread < this.globe.options.maxThread) {
        this._create(x, y, z);
    }

    return null;
};

GoogleTiledLayer.prototype._create = function (x, y, z) {
    var img = document.createElement('img');

    img._x = x;
    img._y = y;
    img._z = z;
    img.crossOrigin = 'anonymous';
    img.loading = true;

    this.cache.set(x, y, z, img);

    img.onload = () => {
        img.onload = null;
        img.onerror = null;

        img.loaded = true;
        delete img.loading;

        this.globe.thread--;
    };

    img.onerror = () => {
        img.onload = null;
        img.onerror = null;

        img.error = true;
        delete img.loading;

        this.globe.thread--;
    };

    img.src = `http://www.google.cn/maps/vt?lyrs=s@821&gl=cn&x=${x}&y=${y}&z=${z}`;

    this.globe.thread++;
};

export default GoogleTiledLayer;