import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * RectAreaLight序列化器
 */
function RectAreaLightSerializer() {
    BaseSerializer.call(this);
}

RectAreaLightSerializer.prototype = Object.create(BaseSerializer.prototype);
RectAreaLightSerializer.prototype.constructor = RectAreaLightSerializer;

RectAreaLightSerializer.prototype.toJSON = function (obj) {
    var json = LightSerializer.prototype.toJSON.call(this, obj);

    json.width = item.width;
    json.height = item.height;

    return json;
};

RectAreaLightSerializer.prototype.fromJSON = function (json) {

};

export default RectAreaLightSerializer;