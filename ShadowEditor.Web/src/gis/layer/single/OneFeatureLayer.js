import FeatureLayer from '../FeatureLayer';

/**
 * 一条数据图层
 * @author tengge / https://github.com/tengge1
 * @param {*} globe 
 */
function OneFeatureLayer(globe) {
    FeatureLayer.call(this, globe);
}

OneFeatureLayer.prototype = Object.create(FeatureLayer.prototype);
OneFeatureLayer.prototype.constructor = OneFeatureLayer;

OneFeatureLayer.prototype.get = function (aabb) {
    // TODO: 根据包围盒返回一条GeoJson数据
};

export default OneFeatureLayer;