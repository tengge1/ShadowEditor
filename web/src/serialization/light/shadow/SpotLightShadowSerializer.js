import BaseSerializer from '../../BaseSerializer';
import LightShadowSerializer from './LightShadowSerializer';

/**
 * SpotLightShadowSerializer
 * @author tengge / https://github.com/tengge1
 */
function SpotLightShadowSerializer() {
    BaseSerializer.call(this);
}

SpotLightShadowSerializer.prototype = Object.create(BaseSerializer.prototype);
SpotLightShadowSerializer.prototype.constructor = SpotLightShadowSerializer;

SpotLightShadowSerializer.prototype.toJSON = function (obj) {
    var json = LightShadowSerializer.prototype.toJSON.call(this, obj);

    json.isSpotLightShadow = obj.isSpotLightShadow;

    return json;
};

SpotLightShadowSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.SpotLightShadow() : parent;

    LightShadowSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default SpotLightShadowSerializer;