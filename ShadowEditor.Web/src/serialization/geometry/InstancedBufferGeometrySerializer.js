import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * InstancedBufferGeometrySerializer
 */
function InstancedBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

InstancedBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
InstancedBufferGeometrySerializer.prototype.constructor = InstancedBufferGeometrySerializer;

InstancedBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

InstancedBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.InstancedBufferGeometry() : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default InstancedBufferGeometrySerializer;