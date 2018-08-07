import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * PolyhedronBufferGeometrySerializer
 */
function PolyhedronBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

PolyhedronBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
PolyhedronBufferGeometrySerializer.prototype.constructor = PolyhedronBufferGeometrySerializer;

PolyhedronBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

PolyhedronBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.PolyhedronBufferGeometry(
        json.parameters.vertices,
        json.parameters.indices,
        json.parameters.radius,
        json.parameters.detail
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default PolyhedronBufferGeometrySerializer;