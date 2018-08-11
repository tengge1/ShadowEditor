import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from '../core/Object3DSerializer';
import LightShadowsSerializer from './shadow/LightShadowsSerializer';

/**
 * LightSerializer
 * @param {*} app 
 */
function LightSerializer(app) {
    BaseSerializer.call(this, app);
}

LightSerializer.prototype = Object.create(BaseSerializer.prototype);
LightSerializer.prototype.constructor = LightSerializer;

LightSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    json.color = obj.color;
    json.intensity = obj.intensity;
    json.isLight = obj.isLight;
    json.shadow = obj.shadow == null ? null : (new LightShadowsSerializer(this.app)).toJSON(obj.shadow);

    return json;
};

LightSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.Light() : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    obj.color = new THREE.Color(json.color);
    obj.intensity = json.intensity;
    obj.isLight = json.isLight;

    if (json.shadow) {
        obj.shadow = (new LightShadowsSerializer(this.app)).fromJSON(json.shadow);
    }

    return obj;
};

export default LightSerializer;