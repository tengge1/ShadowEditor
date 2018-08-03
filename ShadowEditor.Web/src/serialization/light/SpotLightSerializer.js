import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * SpotLight序列化器
 */
function SpotLightSerializer() {
    BaseSerializer.call(this);
}

SpotLightSerializer.prototype = Object.create(BaseSerializer.prototype);
SpotLightSerializer.prototype.constructor = SpotLightSerializer;

SpotLightSerializer.prototype.toJSON = function (obj) {
    var json = LightSerializer.prototype.toJSON(obj);

    json.distance = item.distance;
    json.angle = item.angle;
    json.penumbra = item.penumbra;
    json.decay = item.decay;

    return json;
};

SpotLightSerializer.prototype.fromJSON = function (json) {

};

export default SpotLightSerializer;