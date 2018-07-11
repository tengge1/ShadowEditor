import BaseSerializer from '../BaseSerializer';
import LightSerializer from './LightSerializer';

/**
 * RectAreaLight串行化
 */
function RectAreaLightSerializer() {
    BaseSerializer.call(this);
}

RectAreaLightSerializer.prototype = Object.create(BaseSerializer.prototype);
RectAreaLightSerializer.prototype.constructor = RectAreaLightSerializer;

RectAreaLightSerializer.prototype.toJSON = function (obj) {
    var obj = LightSerializer.prototype.toJSON(obj);

    obj.width = item.width;
    oboj.height = item.height;

    return obj;
};

RectAreaLightSerializer.prototype.fromJSON = function (json) {

};

export default RectAreaLightSerializer;