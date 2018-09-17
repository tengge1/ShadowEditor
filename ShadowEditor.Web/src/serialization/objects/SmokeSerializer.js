import BaseSerializer from '../BaseSerializer';
import MeshSerializer from '../core/MeshSerializer';

/**
 * SmokeSerializer
 * @author tengge / https://github.com/tengge1
 */
function SmokeSerializer() {
    BaseSerializer.call(this);
}

SmokeSerializer.prototype = Object.create(BaseSerializer.prototype);
SmokeSerializer.prototype.constructor = SmokeSerializer;

SmokeSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    json.userData.smoke = null;

    return json;
};

SmokeSerializer.prototype.fromJSON = function (json, parent, camera, renderer) {
    var smoke = parent || new Smoke(camera, renderer);

    MeshSerializer.prototype.fromJSON.call(this, json, obj.mesh);

    obj.mesh.userData.smoke = obj;

    obj.update(0);

    return obj.mesh;
};

export default SmokeSerializer;