import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * SpotLight串行化
 */
function SpotLightSerializer() {
    BaseSerializer.call(this);
}

SpotLightSerializer.prototype = Object.create(BaseSerializer.prototype);
SpotLightSerializer.prototype.constructor = SpotLightSerializer;

SpotLightSerializer.prototype.toJSON = function (obj) {
    var obj = LightSerializer.prototype.toJSON(obj);

    obj.distance = item.distance;
    obj.angle = item.angle;
    obj.penumbra = item.penumbra;
    obj.decay = item.decay;

    return obj;
};

SpotLightSerializer.prototype.fromJSON = function (json) {

};

export default SpotLightSerializer;