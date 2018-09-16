import BaseSerializer from '../BaseSerializer';
import MeshSerializer from '../core/MeshSerializer';

/**
 * FireSerializer
 * @author tengge / https://github.com/tengge1
 */
function FireSerializer() {
    BaseSerializer.call(this);
}

FireSerializer.prototype = Object.create(BaseSerializer.prototype);
FireSerializer.prototype.constructor = FireSerializer;

FireSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    json.userData.fire = null;

    return json;
};

FireSerializer.prototype.fromJSON = function (json, parent, camera) {
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

    return obj.mesh;
};

export default FireSerializer;