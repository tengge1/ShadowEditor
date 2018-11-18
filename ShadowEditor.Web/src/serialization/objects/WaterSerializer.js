import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from '../core/Object3DSerializer';
import Water from '../../object/component/Water';

/**
 * WaterSerializer
 * @author tengge / https://github.com/tengge1
 */
function WaterSerializer() {
    BaseSerializer.call(this);
}

WaterSerializer.prototype = Object.create(BaseSerializer.prototype);
WaterSerializer.prototype.constructor = WaterSerializer;

WaterSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);
    return json;
};

WaterSerializer.prototype.fromJSON = function (json, parent, renderer) {
    var obj = new Water(renderer);

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    obj.update();

    return obj;
};

export default WaterSerializer;