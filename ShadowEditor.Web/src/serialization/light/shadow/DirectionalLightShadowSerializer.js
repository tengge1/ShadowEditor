import BaseSerializer from '../../BaseSerializer';
import LightShadowSerializer from './LightShadowSerializer';

/**
 * DirectionalLightShadowSerializer
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function DirectionalLightShadowSerializer(app) {
    BaseSerializer.call(this, app);
}

DirectionalLightShadowSerializer.prototype = Object.create(BaseSerializer.prototype);
DirectionalLightShadowSerializer.prototype.constructor = DirectionalLightShadowSerializer;

DirectionalLightShadowSerializer.prototype.toJSON = function (obj) {
    var json = LightShadowSerializer.prototype.toJSON.call(this, obj);

    json.isDirectionalLightShadow = obj.isDirectionalLightShadow;

    return json;
};

DirectionalLightShadowSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.DirectionalLightShadow() : parent;

    LightShadowSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default DirectionalLightShadowSerializer;