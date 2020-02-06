import Layer from './Layer';

/**
 * 数据图层
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 地球
 */
function FeatureLayer(globe) {
    Layer.call(this, globe);
}

FeatureLayer.prototype = Object.create(Layer.prototype);
FeatureLayer.prototype.constructor = FeatureLayer;

export default FeatureLayer;