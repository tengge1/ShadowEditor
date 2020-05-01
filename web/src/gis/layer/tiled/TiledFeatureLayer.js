import FeatureLayer from '../FeatureLayer';

/**
 * 数据瓦片图层
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 地球
 */
function TiledFeatureLayer(globe) {
    FeatureLayer.call(this, globe);
}

TiledFeatureLayer.prototype = Object.create(FeatureLayer.prototype);
TiledFeatureLayer.prototype.constructor = TiledFeatureLayer;

TiledFeatureLayer.prototype.get = function (aabb) { // eslint-disable-line

};

export default TiledFeatureLayer;