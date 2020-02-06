import Layer from './Layer';

/**
 * 图片图层
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 地球
 */
function ImageLayer(globe) {
    Layer.call(this, globe);
}

ImageLayer.prototype = Object.create(Layer.prototype);
ImageLayer.prototype.constructor = ImageLayer;

export default ImageLayer;