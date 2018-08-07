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

    return json;
};

LightSerializer.prototype.fromJSON = function (json) {

};

export default LightSerializer;