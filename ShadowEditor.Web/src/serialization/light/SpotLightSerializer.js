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
    var json = LightSerializer.prototype.toJSON.call(this, obj);

    json.distance = obj.distance;
    json.angle = obj.angle;
    json.penumbra = obj.penumbra;
    json.decay = obj.decay;

    return json;
};

SpotLightSerializer.prototype.fromJSON = function (json) {

};

export default SpotLightSerializer;