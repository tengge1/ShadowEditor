import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * HemisphereLightSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function HemisphereLightSerializer(app) {
    BaseSerializer.call(this, app);
}

HemisphereLightSerializer.prototype = Object.create(BaseSerializer.prototype);
HemisphereLightSerializer.prototype.constructor = HemisphereLightSerializer;

HemisphereLightSerializer.prototype.toJSON = function (obj) {
    var json = LightSerializer.prototype.toJSON.call(this, obj);

    json.isHemisphereLight = obj.isHemisphereLight;
    json.skyColor = obj.skyColor;
    json.groundColor = obj.groundColor;

    return json;
};

HemisphereLightSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.HemisphereLight(json.skyColor, json.groundColor, json.intensity) : parent;

    LightSerializer.prototype.fromJSON.call(this, json, obj);

    obj.isHemisphereLight = json.isHemisphereLight;

    return obj;
};

export default HemisphereLightSerializer;