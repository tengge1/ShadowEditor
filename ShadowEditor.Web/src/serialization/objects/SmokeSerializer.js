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

    json.userData.fire = null;

    return json;
};

SmokeSerializer.prototype.fromJSON = function (json, parent, camera) {
    VolumetricFire.texturePath = 'assets/textures/VolumetricFire/';

    var obj = parent || new VolumetricFire(
        json.userData.width,
        json.userData.height,
        json.userData.depth,
        json.userData.sliceSpacing,
        camera
    );

    MeshSerializer.prototype.fromJSON.call(this, json, obj.mesh);

    obj.mesh.userData.fire = obj;

    obj.update(0);

    return obj.mesh;
};

export default SmokeSerializer;