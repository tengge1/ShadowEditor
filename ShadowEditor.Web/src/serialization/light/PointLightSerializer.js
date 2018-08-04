import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * PointLight序列化器
 */
function PointLightSerializer() {
    BaseSerializer.call(this);
}

PointLightSerializer.prototype = Object.create(BaseSerializer.prototype);
PointLightSerializer.prototype.constructor = PointLightSerializer;

PointLightSerializer.prototype.toJSON = function (obj) {
    var json = LightSerializer.prototype.toJSON.call(this, obj);

    json.distance = item.distance;
    json.decay = item.decay;

    return json;
};

PointLightSerializer.prototype.fromJSON = function (json) {

};

export default PointLightSerializer;