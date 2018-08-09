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
    json.shadow = obj.shadow;

    return json;
};

LightSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.Light() : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    obj.color = new THREE.Color(json.color);
    obj.intensity = json.intensity;
    obj.isLight = json.isLight;
    obj.shadow = json.shadow;

    return obj;
};

export default LightSerializer;