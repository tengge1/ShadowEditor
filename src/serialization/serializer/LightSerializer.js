import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

/**
 * 网格串行化
 */
function LightSerializer() {
    BaseSerializer.call(this);
}

LightSerializer.prototype = Object.create(BaseSerializer.prototype);
LightSerializer.prototype.constructor = LightSerializer;

LightSerializer.prototype.toJSON = function (obj) {
    var obj = Object3DSerializer.prototype.toJSON(obj);

    obj.color = item.color;
    obj.intensity = item.intensity;

    return obj;
};

LightSerializer.prototype.fromJSON = function (json) {

};

export default LightSerializer;