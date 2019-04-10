import Layer from './Layer';

/**
 * 数据图层
 * @author tengge / https://github.com/tengge1
 */
function FeatureLayer() {
    Layer.call(this);
}

FeatureLayer.prototype = Object.create(Layer.prototype);
FeatureLayer.prototype.constructor = FeatureLayer;

export default FeatureLayer;