import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * PointLight串行化
 */
function PointLightSerializer() {
    BaseSerializer.call(this);
}

PointLightSerializer.prototype = Object.create(BaseSerializer.prototype);
PointLightSerializer.prototype.constructor = PointLightSerializer;

PointLightSerializer.prototype.toJSON = function (obj) {
    var obj = LightSerializer.prototype.toJSON(obj);

    obj.distance = item.distance;
    obj.decay = item.decay;

    return obj;
};

PointLightSerializer.prototype.fromJSON = function (json) {

};

export default PointLightSerializer;