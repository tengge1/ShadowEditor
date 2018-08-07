import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * OctahedronBufferGeometrySerializer
 */
function OctahedronBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

OctahedronBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
OctahedronBufferGeometrySerializer.prototype.constructor = OctahedronBufferGeometrySerializer;

OctahedronBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

OctahedronBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.OctahedronBufferGeometry(
        json.radius,
        json.detail
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, obj);

    return obj;
};

export default OctahedronBufferGeometrySerializer;