import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * DirectionalLightSerializer
 */
function DirectionalLightSerializer() {
    BaseSerializer.call(this);
}

DirectionalLightSerializer.prototype = Object.create(BaseSerializer.prototype);
DirectionalLightSerializer.prototype.constructor = DirectionalLightSerializer;

DirectionalLightSerializer.prototype.toJSON = function (obj) {
    var json = LightSerializer.prototype.toJSON.call(this, obj);

    json.color = obj.color;
    json.intensity = obj.intensity;

    return json;
};

DirectionalLightSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined? new THREE.DirectionalLight(json.color, json.intensity) : parent;

    obj.color = json.color;
    obj.intensity = json.intensity;

    return json;
};

export default DirectionalLightSerializer;