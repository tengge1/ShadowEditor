import BaseSerializer from '../BaseSerializer';
import MeshSerializer from '../core/MeshSerializer';
import QuadraticBezierCurve from '../../object/line/QuadraticBezierCurve';

/**
 * QuadraticBezierCurveSerializer
 * @author tengge / https://github.com/tengge1
 */
function QuadraticBezierCurveSerializer() {
    BaseSerializer.call(this);
}

QuadraticBezierCurveSerializer.prototype = Object.create(BaseSerializer.prototype);
QuadraticBezierCurveSerializer.prototype.constructor = QuadraticBezierCurveSerializer;

QuadraticBezierCurveSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    return json;
};

QuadraticBezierCurveSerializer.prototype.fromJSON = function (json, parent) {
    json.userData.points = json.userData.points.map(n => {
        return new THREE.Vector3().copy(n);
    });

    var obj = parent || new QuadraticBezierCurve(json.userData);

    MeshSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default QuadraticBezierCurveSerializer;