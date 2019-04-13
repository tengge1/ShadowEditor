import BingTileSystem from '../../utils/BingTileSystem';

var bing = new BingTileSystem();

/**
 * 瓦片材质
 * @author tengge / https://github.com/tengge1
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function TiledMaterial(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.loaded = false;
    this.loading = false;
    this.error = false;
}

TiledMaterial.prototype.load = function () {
    if (this.z < 1) { // 0层级没底图
        return;
    }

    this.image = document.createElement('img');
    this.image.crossOrigin = 'anonymous';

    this.image.onload = this._onLoad.bind(this);
    this.image.onerror = this._onError.bind(this);

    this.image.src = `http://www.google.cn/maps/vt?lyrs=s@821&gl=cn&x=${this.x}&y=${this.y}&z=${this.z}`;
    //this.image.src = `http://t6.tianditu.gov.cn/DataServer?T=img_w&x=${x}&y=${y}&l=${z}&tk=85a57b38db5ed01efb7e999f6b097746`;
    // this.image.src = bing.tileXYToUrl(x, y, z);
};

TiledMaterial.prototype._onLoad = function () {
    this.image.onload = null;
    this.image.onerror = null;
    this.loaded = true;
};

TiledMaterial.prototype._onError = function () {
    this.image.onload = null;
    this.image.onerror = null;
};

export default TiledMaterial;