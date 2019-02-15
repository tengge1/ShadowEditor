import BaseSerializer from '../BaseSerializer';
import MeshSerializer from '../core/MeshSerializer';
import CatmullRomCurve from '../../object/line/CatmullRomCurve';

/**
 * EllipseCurveSerializer
 * @author tengge / https://github.com/tengge1
 */
function EllipseCurveSerializer() {
    BaseSerializer.call(this);
}

EllipseCurveSerializer.prototype = Object.create(BaseSerializer.prototype);
EllipseCurveSerializer.prototype.constructor = EllipseCurveSerializer;

EllipseCurveSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    return json;
};

EllipseCurveSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent || new CatmullRomCurve(json.userData);

    MeshSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default EllipseCurveSerializer;