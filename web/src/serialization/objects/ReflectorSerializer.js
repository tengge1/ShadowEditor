import BaseSerializer from '../BaseSerializer';
import MeshSerializer from '../core/MeshSerializer';
import GeometriesSerializer from '../geometry/GeometriesSerializer';

/**
 * ReflectorSerializer
 * @author tengge / https://github.com/tengge1
 */
function ReflectorSerializer() {
    BaseSerializer.call(this);
}

ReflectorSerializer.prototype = Object.create(BaseSerializer.prototype);
ReflectorSerializer.prototype.constructor = ReflectorSerializer;

ReflectorSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    if (json.userData.mesh) {
        json.userData.mesh = new MeshSerializer().toJSON(json.userData.mesh);
    }

    return json;
};

ReflectorSerializer.prototype.fromJSON = function (json) {
    var geometry = new GeometriesSerializer().fromJSON(json.geometry);
    var obj = new THREE.Reflector(geometry, {
        color: json.userData.color,
        textureWidth: parseInt(json.userData.size),
        textureHeight: parseInt(json.userData.size),
        clipBias: json.userData.clipBias,
        recursion: json.userData.recursion ? 1 : 0
    });

    MeshSerializer.prototype.fromJSON.call(this, json, obj);

    if (obj.userData.mesh) {
        obj.userData.mesh = new MeshSerializer().fromJSON(obj.userData.mesh);
    }

    return obj;
};

export default ReflectorSerializer;