import BaseSerializer from '../BaseSerializer';
import MeshSerializer from '../core/MeshSerializer';
import LineCurve from '../../object/line/LineCurve';

/**
 * LineCurveSerializer
 * @author tengge / https://github.com/tengge1
 */
function LineCurveSerializer() {
    BaseSerializer.call(this);
}

LineCurveSerializer.prototype = Object.create(BaseSerializer.prototype);
LineCurveSerializer.prototype.constructor = LineCurveSerializer;

LineCurveSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    return json;
};

LineCurveSerializer.prototype.fromJSON = function (json, parent) {
    json.userData.points = json.userData.points.map(n => {
        return new THREE.Vector3().copy(n);
    });

    var obj = parent || new LineCurve(json.userData);

    MeshSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default LineCurveSerializer;