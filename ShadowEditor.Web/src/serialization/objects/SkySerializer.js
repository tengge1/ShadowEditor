import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from '../core/Object3DSerializer';
import Sky from '../../object/Sky';

/**
 * SkySerializer
 * @author tengge / https://github.com/tengge1
 */
function SkySerializer() {
    BaseSerializer.call(this);
}

SkySerializer.prototype = Object.create(BaseSerializer.prototype);
SkySerializer.prototype.constructor = SkySerializer;

SkySerializer.prototype.toJSON = function (obj) {
    return Object3DSerializer.prototype.toJSON.call(this, obj);
};

SkySerializer.prototype.fromJSON = function (json, parent, camera) {
    var obj = new Sky(json);

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default SkySerializer;