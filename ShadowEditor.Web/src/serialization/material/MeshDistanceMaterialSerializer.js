import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * MeshDistanceMaterialSerializer
 */
function MeshDistanceMaterialSerializer() {
    BaseSerializer.call(this);
}

MeshDistanceMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
MeshDistanceMaterialSerializer.prototype.constructor = MeshDistanceMaterialSerializer;

MeshDistanceMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

MeshDistanceMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.MeshDistanceMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default MeshDistanceMaterialSerializer;