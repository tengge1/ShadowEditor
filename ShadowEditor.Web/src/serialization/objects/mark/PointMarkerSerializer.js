import BaseSerializer from '../../BaseSerializer';
import Object3DSerializer from '../../core/Object3DSerializer';
import PointMarker from '../../../object/mark/PointMarker';

/**
 * PointMarkerSerializer
 * @author tengge / https://github.com/tengge1
 */
function PointMarkerSerializer() {
    BaseSerializer.call(this);
}

PointMarkerSerializer.prototype = Object.create(BaseSerializer.prototype);
PointMarkerSerializer.prototype.constructor = PointMarkerSerializer;

PointMarkerSerializer.prototype.toJSON = function (obj) {
    return Object3DSerializer.prototype.toJSON.call(this, obj);
};

PointMarkerSerializer.prototype.fromJSON = function (json, parent) {
    var obj = new PointMarker(json.userData.text);

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default PointMarkerSerializer;