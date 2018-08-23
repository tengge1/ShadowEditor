import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * DirectionalLightSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function DirectionalLightSerializer(app) {
    BaseSerializer.call(this, app);
}

DirectionalLightSerializer.prototype = Object.create(BaseSerializer.prototype);
DirectionalLightSerializer.prototype.constructor = DirectionalLightSerializer;

DirectionalLightSerializer.prototype.toJSON = function (obj) {
    var json = LightSerializer.prototype.toJSON.call(this, obj);

    json.isDirectionalLight = obj.isDirectionalLight;

    return json;
};

DirectionalLightSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.DirectionalLight(json.color, json.intensity) : parent;

    LightSerializer.prototype.fromJSON.call(this, json, obj);

    obj.isDirectionalLight = json.isDirectionalLight;

    return obj;
};

export default DirectionalLightSerializer;