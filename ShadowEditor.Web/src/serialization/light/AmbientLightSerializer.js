import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * AmbientLightSerializer
 */
function AmbientLightSerializer() {
    BaseSerializer.call(this);
}

AmbientLightSerializer.prototype = Object.create(BaseSerializer.prototype);
AmbientLightSerializer.prototype.constructor = AmbientLightSerializer;

AmbientLightSerializer.prototype.toJSON = function (obj) {
    var json = LightSerializer.prototype.toJSON.call(this, obj);

    json.color = obj.color;
    json.intensity = obj.intensity;

    return json;
};

AmbientLightSerializer.prototype.fromJSON = function (json) {

};

export default AmbientLightSerializer;