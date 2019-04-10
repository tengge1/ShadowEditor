import FeatureLayer from '../FeatureLayer';

/**
 * 数据瓦片图层
 * @author tengge / https://github.com/tengge1
 */
function TiledFeatureLayer() {
    FeatureLayer.call(this);

    this.tree = rbush();
}

TiledFeatureLayer.prototype = Object.create(FeatureLayer.prototype);
TiledFeatureLayer.prototype.constructor = TiledFeatureLayer;

TiledFeatureLayer.prototype.get = function (aabb) {

};

export default TiledFeatureLayer;