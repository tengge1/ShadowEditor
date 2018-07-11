import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * HemisphereLight串行化
 */
function HemisphereLightSerializer() {
    BaseSerializer.call(this);
}

HemisphereLightSerializer.prototype = Object.create(BaseSerializer.prototype);
HemisphereLightSerializer.prototype.constructor = HemisphereLightSerializer;

HemisphereLightSerializer.prototype.toJSON = function (obj) {
    var obj = LightSerializer.prototype.toJSON(obj);

    obj.skyColor = item.skyColor;
    obj.groundColor = item.groundColor;

    return obj;
};

HemisphereLightSerializer.prototype.fromJSON = function (json) {

};

export default HemisphereLightSerializer;