import BaseSerializer from '../BaseSerializer';
import Object3DSerializer from './Object3DSerializer';

import BufferGeometriesSerializer from '../geometry/BufferGeometriesSerializer';
import MaterialsSerializer from '../material/MaterialsSerializer';

/**
 * Mesh序列化器
 */
function MeshSerializer() {
    BaseSerializer.call(this);
}

MeshSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshSerializer.prototype.constructor = MeshSerializer;

MeshSerializer.prototype.toJSON = function (obj) {
    var json = Object3DSerializer.prototype.toJSON.call(this, obj);

    json.drawMode = obj.drawMode;
    json.geometry = (new BufferGeometriesSerializer()).toJSON(obj.geometry);
    json.material = (new MaterialsSerializer()).toJSON(obj.material);

    return json;
};

MeshSerializer.prototype.fromJSON = function (json, parent) {
    var geometry, material;

    if (parent === undefined) {
        geometry = (new BufferGeometriesSerializer()).fromJSON(json.geometry);
        material = (new MaterialsSerializer()).fromJSON(json.material);
    }

    var obj = parent === undefined ? new THREE.Mesh(geometry, material) : parent;

    Object3DSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default MeshSerializer;