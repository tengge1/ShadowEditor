import BaseSerializer from '../../BaseSerializer';
import MeshSerializer from '../../core/MeshSerializer';
import CatmullRomCurve from '../../../object/line/CatmullRomCurve';

/**
 * CatmullRomCurveSerializer
 * @author tengge / https://github.com/tengge1
 */
function CatmullRomCurveSerializer() {
    BaseSerializer.call(this);
}

CatmullRomCurveSerializer.prototype = Object.create(BaseSerializer.prototype);
CatmullRomCurveSerializer.prototype.constructor = CatmullRomCurveSerializer;

CatmullRomCurveSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    return json;
};

CatmullRomCurveSerializer.prototype.fromJSON = function (json, parent) {
    json.userData.points = json.userData.points.map(n => {
        return new THREE.Vector3().copy(n);
    });

    var obj = parent || new CatmullRomCurve(json.userData);

    MeshSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default CatmullRomCurveSerializer;