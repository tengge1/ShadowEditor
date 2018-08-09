import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from '../core/Object3DSerializer';

/**
 * Light序列化器
 */
function LightSerializer() {
    BaseSerializer.call(this);
}

LightSerializer.prototype = Object.create(BaseSerializer.prototype);
LightSerializer.prototype.constructor = LightSerializer;

LightSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    json.color = obj.color;
    json.intensity = obj.intensity;
    json.isLight = obj.isLight;
    json.onlyShadow = obj.onlyShadow;
    json.shadowBias = obj.shadowBias;
    json.shadowCameraBottom = obj.shadowCameraBottom;
    json.shadowCameraFar = obj.shadowCameraFar;
    json.shadowCameraFov = obj.shadowCameraFov;
    json.shadowCameraLeft = obj.shadowCameraLeft;
    json.shadowCameraNear = obj.shadowCameraNear;
    json.shadowCameraRight = obj.shadowCameraRight;
    json.shadowCameraTop = obj.shadowCameraTop;
    json.shadowCameraVisible = obj.shadowCameraVisible;
    json.shadowDarkness = obj.shadowDarkness;
    json.shadowMapHeight = obj.shadowMapHeight;
    json.shadowMapWidth = obj.shadowMapWidth;

    return json;
};

LightSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.Light() : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    obj.color = json.color;
    obj.intensity = json.intensity;
    obj.isLight = json.isLight;
    obj.onlyShadow = json.onlyShadow;
    obj.shadowBias = json.shadowBias;
    obj.shadowCameraBottom = json.shadowCameraBottom;
    obj.shadowCameraFar = json.shadowCameraFar;
    obj.shadowCameraFov = json.shadowCameraFov;
    obj.shadowCameraLeft = json.shadowCameraLeft;
    obj.shadowCameraNear = json.shadowCameraNear;
    obj.shadowCameraRight = json.shadowCameraRight;
    obj.shadowCameraTop = json.shadowCameraTop;
    obj.shadowCameraVisible = json.shadowCameraVisible;
    obj.shadowDarkness = json.shadowDarkness;
    obj.shadowMapHeight = json.shadowMapHeight;
    obj.shadowMapWidth = json.shadowMapWidth;

    return obj;
};

export default LightSerializer;