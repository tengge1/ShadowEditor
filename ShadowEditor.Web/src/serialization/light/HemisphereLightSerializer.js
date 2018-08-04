import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * HemisphereLight序列化器
 */
function HemisphereLightSerializer() {
    BaseSerializer.call(this);
}

HemisphereLightSerializer.prototype = Object.create(BaseSerializer.prototype);
HemisphereLightSerializer.prototype.constructor = HemisphereLightSerializer;

HemisphereLightSerializer.prototype.toJSON = function (obj) {
    var json = LightSerializer.prototype.toJSON.call(this, obj);

    json.skyColor = item.skyColor;
    json.groundColor = item.groundColor;

    return json;
};

HemisphereLightSerializer.prototype.fromJSON = function (json) {

};

export default HemisphereLightSerializer;