import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * PointLightSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function PointLightSerializer(app) {
    BaseSerializer.call(this, app);
}

PointLightSerializer.prototype = Object.create(BaseSerializer.prototype);
PointLightSerializer.prototype.constructor = PointLightSerializer;

PointLightSerializer.prototype.toJSON = function (obj) {
    var json = LightSerializer.prototype.toJSON.call(this, obj);

    json.isPointLight = obj.isPointLight;
    json.distance = obj.distance;
    json.decay = obj.decay;

    return json;
};

PointLightSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.PointLight(json.color, json.intensity, json.distance, json.decay) : parent;

    LightSerializer.prototype.fromJSON.call(this, json, obj);

    obj.isPointLight = json.isPointLight;

    return obj;
};

export default PointLightSerializer;