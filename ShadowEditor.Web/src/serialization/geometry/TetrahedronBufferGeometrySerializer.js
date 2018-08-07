import BaseSerializer from '../BaseSerializer';
import BufferGeometrySerializer from './BufferGeometrySerializer';

/**
 * TetrahedronBufferGeometrySerializer
 */
function TetrahedronBufferGeometrySerializer() {
    BaseSerializer.call(this);
}

TetrahedronBufferGeometrySerializer.prototype = Object.create(BaseSerializer.prototype);
TetrahedronBufferGeometrySerializer.prototype.constructor = TetrahedronBufferGeometrySerializer;

TetrahedronBufferGeometrySerializer.prototype.toJSON = function (obj) {
    return BufferGeometrySerializer.prototype.toJSON.call(this, obj);
};

TetrahedronBufferGeometrySerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.TetrahedronBufferGeometry(
        json.parameters.radius,
        json.parameters.detail
    ) : parent;

    BufferGeometrySerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default TetrahedronBufferGeometrySerializer;