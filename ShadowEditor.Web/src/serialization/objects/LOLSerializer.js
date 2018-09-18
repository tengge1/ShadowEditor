import BaseSerializer from '../BaseSerializer';
import MeshSerializer from '../core/MeshSerializer';
import Smoke from '../../particle/Smoke';

/**
 * LOLSerializer
 * @author tengge / https://github.com/tengge1
 */
function LOLSerializer() {
    BaseSerializer.call(this);
}

LOLSerializer.prototype = Object.create(BaseSerializer.prototype);
LOLSerializer.prototype.constructor = LOLSerializer;

LOLSerializer.prototype.toJSON = function (obj) {
    var json = MeshSerializer.prototype.toJSON.call(this, obj);

    debugger

    return json;
};

LOLSerializer.prototype.fromJSON = function (json, parent, camera, renderer) {
    var obj = parent || new Smoke(camera, renderer);

    MeshSerializer.prototype.fromJSON.call(this, json, obj.mesh);

    obj.mesh.userData.smoke = obj;

    obj.update(0);

    return obj.mesh;
};

export default LOLSerializer;