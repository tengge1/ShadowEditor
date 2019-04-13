import ImageLayer from '../ImageLayer';
import TileCache from '../../utils/TileCache';

/**
 * 图片瓦片图层
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 
 */
function TiledImageLayer(globe) {
    ImageLayer.call(this, globe);

    this.cache = new TileCache();
}

TiledImageLayer.prototype = Object.create(ImageLayer.prototype);
TiledImageLayer.prototype.constructor = TiledImageLayer;

/**
 * 由子类实现，返回下载图片的url
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
TiledImageLayer.prototype.getUrl = function (x, y, z) {
    return null;
};

/**
 * 获取图片数据
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
TiledImageLayer.prototype.get = function (x, y, z) {
    var img = this.cache.get(x, y, z);

    if (img && img.loaded) {
        return img;
    }

    if (img && (img.loading || img.error)) {
        return null;
    }

    if (this.globe.thread < this.globe.options.maxThread) {
        this._createImage(x, y, z);
    }

    return null;
};


TiledImageLayer.prototype._createImage = function (x, y, z) {
    var url = this.getUrl(x, y, z);

    if (!url) {
        console.warn(`TiledImageLayer: url is not defined.`);
        return null;
    }

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

    img.src = url;
    this.globe.thread++;
};

export default TiledImageLayer;