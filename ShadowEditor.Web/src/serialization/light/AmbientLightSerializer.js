import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * AmbientLightSerializer
 * @param {*} app 
 */
function AmbientLightSerializer(app) {
    BaseSerializer.call(this, app);
}

AmbientLightSerializer.prototype = Object.create(BaseSerializer.prototype);
AmbientLightSerializer.prototype.constructor = AmbientLightSerializer;

AmbientLightSerializer.prototype.toJSON = function (obj) {
    var json = LightSerializer.prototype.toJSON.call(this, obj);

    json.isAmbientLight = obj.isAmbientLight;

    return json;
};

AmbientLightSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.AmbientLight(json.color, json.intensity) : parent;

    LightSerializer.prototype.fromJSON.call(this, json, obj);

    obj.isAmbientLight = json.isAmbientLight;

    return obj;
};

export default AmbientLightSerializer;