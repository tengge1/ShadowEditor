import BaseSerializer from '../BaseSerializer';
import MeshSerializer from '../core/MeshSerializer';
import Spline from '../../object/line/Spline';

/**
 * SplineSerializer
 * @author tengge / https://github.com/tengge1
 */
function SplineSerializer() {
    BaseSerializer.call(this);
}

SplineSerializer.prototype = Object.create(BaseSerializer.prototype);
SplineSerializer.prototype.constructor = SplineSerializer;

SplineSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    return json;
};

SplineSerializer.prototype.fromJSON = function (json, parent) {
    json.userData.points = json.userData.points.map(n => {
        return new THREE.Vector3().copy(n);
    });

    var obj = parent || new Spline(json.userData);

    MeshSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default SplineSerializer;