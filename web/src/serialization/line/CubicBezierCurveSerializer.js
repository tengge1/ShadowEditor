import BaseSerializer from '../BaseSerializer';
import MeshSerializer from '../core/MeshSerializer';
import CubicBezierCurve from '../../object/line/CubicBezierCurve';

/**
 * CubicBezierCurveSerializer
 * @author tengge / https://github.com/tengge1
 */
function CubicBezierCurveSerializer() {
    BaseSerializer.call(this);
}

CubicBezierCurveSerializer.prototype = Object.create(BaseSerializer.prototype);
CubicBezierCurveSerializer.prototype.constructor = CubicBezierCurveSerializer;

CubicBezierCurveSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    return json;
};

CubicBezierCurveSerializer.prototype.fromJSON = function (json, parent) {
    json.userData.points = json.userData.points.map(n => {
        return new THREE.Vector3().copy(n);
    });

    var obj = parent || new CubicBezierCurve(json.userData);

    MeshSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default CubicBezierCurveSerializer;