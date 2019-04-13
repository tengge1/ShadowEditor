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

TiandituTiledLayer.prototype.getUrl = function (x, y, z) {
    return `http://t6.tianditu.gov.cn/DataServer?T=img_w&x=${x}&y=${y}&l=${z}&tk=85a57b38db5ed01efb7e999f6b097746`;
};

export default TiandituTiledLayer;