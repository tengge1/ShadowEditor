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
 * 获取图片数据
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
TiledImageLayer.prototype.get = function (x, y, z) {

};

export default TiledImageLayer;